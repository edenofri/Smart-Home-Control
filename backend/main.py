# !pip -q install tuya-connector-python
from tuya_connector import TuyaOpenAPI
# from google.colab import userdata
import json

# ======== CONFIGURATION ========
ACCESS_ID = userdata.get('ACCESS_ID')
ACCESS_KEY = userdata.get('ACCESS_KEY')
API_ENDPOINT = "https://openapi.tuyaeu.com"   # Central Europe region (for Israel)
DEVICES = {
    "living_room1": userdata.get('TUYA_living_room1_ID'),
    "living_room2": userdata.get('TUYA_living_room2_ID'),
    "living_room3": userdata.get('TUYA_living_room3_ID'),
    "kitchen": userdata.get('TUYA_kitchen_ID'),
    "smart_ir": userdata.get('TUYA_SMART_IR_ID'),
    "dual_relay": userdata.get('TUYA_DUAL_RELAY_ID'),
    "boiler": userdata.get('TUYA_BOILER_ID')
}

# ======== CONNECT TO API ========
openapi = TuyaOpenAPI(API_ENDPOINT, ACCESS_ID, ACCESS_KEY)
openapi.connect()

# ======== COMMAND HELPERS ========

def _dp_code(channel:int) -> str:
    """Return DP code for the relay channel (1->switch_1, ...)."""
    return f"switch_{int(channel)}"

def switch_set(room:str, on:bool, channel:int=1):
    """Turn switch ON/OFF for a given room and channel."""
    did = DEVICES.get(room)
    if not did:
        print(f"❌ Unknown device name: {room}")
        return
    payload = {"commands": [{"code": _dp_code(channel), "value": bool(on)}]}
    resp = openapi.post(f"/v1.0/iot-03/devices/{did}/commands", payload)
    print(f"[{room} ch{channel}] -> {'ON' if on else 'OFF'}")
    print(json.dumps(resp, ensure_ascii=False, indent=2))

def switch_status(room:str):
    """Print full device status (all DPs)."""
    did = DEVICES.get(room)
    if not did:
        print(f"❌ Unknown device name: {room}")
        return
    status = openapi.get(f"/v1.0/iot-03/devices/{did}/status")
    print(f"[{room}] status:")
    print(json.dumps(status, ensure_ascii=False, indent=2))

def get_ir_remotes(infrared_id=None):
    """List remotes bound to this IR device, pick one remote_id."""
    if infrared_id is None:
        infrared_id = DEVICES.get('smart_ir')
    if not infrared_id:
        print("❌ smart_ir device not configured")
        return None
    
    resp = openapi.get(f"/v2.0/infrareds/{infrared_id}/remotes")
    # Expect result = [ { remote_id, remote_name, ...}, ... ]
    print("Remotes:", json.dumps(resp, ensure_ascii=False, indent=2))
    remotes = (resp or {}).get("result") or []
    return remotes[0]["remote_id"] if remotes else None

def ac_ir_scene_command(power:int, mode:int=None, temp:int=None, wind:int=None,
                        infrared_id=None, remote_id=None):
    """
    Send multi-key AC command via IR (scene):
      power: 1 on, 0 off (required)
      mode:  0 cool, 1 heat, 2 auto, 3 fan, 4 dry (optional)
      temp:  16..30 (optional)
      wind:  0 auto, 1 low, 2 med, 3 high (optional)
    """
    if infrared_id is None:
        infrared_id = DEVICES.get('smart_ir')
    if not infrared_id:
        print("❌ smart_ir device not configured")
        return None
    
    if not remote_id:
        remote_id = get_ir_remotes(infrared_id)
        if not remote_id:
            raise RuntimeError("No remote_id found for this IR device.")

    body = {"power": int(power)}
    if mode is not None: body["mode"] = int(mode)
    if temp is not None: body["temp"] = max(16, min(30, int(temp)))
    if wind is not None: body["wind"] = int(wind)

    # IR AC "scenes" (multi-keys) command:
    path = f"/v2.0/infrareds/{infrared_id}/air-conditioners/{remote_id}/scenes/command"
    resp = openapi.post(path, body)
    print("IR scenes command →", json.dumps(resp, ensure_ascii=False, indent=2))
    return resp
	
def relay_countdown(room:str, seconds:int, channel:int=1):
    """Set countdown for channel 1 or 2 (0-86400s)."""
    did = DEVICES.get(room)
    if not did: return
    payload = {"commands": [{"code": f"countdown_{channel}", "value": seconds}]}
    resp = openapi.post(f"/v1.0/iot-03/devices/{did}/commands", payload)
    print(f"[{room} ch{channel}] Countdown set to {seconds}s")
    return resp

def relay_power_strategy(room:str, mode:str):
    """Set behavior after power failure: 'power_off', 'power_on', 'last'."""
    did = DEVICES.get(room)
    if not did: return
    payload = {"commands": [{"code": "relay_status", "value": mode}]}
    resp = openapi.post(f"/v1.0/iot-03/devices/{did}/commands", payload)
    print(f"[{room}] Power-on strategy: {mode}")
    return resp

# ======== EXAMPLES ========

# Turn living room 1 ON
# switch_set("living_room1", True)

# Turn living room 2 OFF
# switch_set("living_room2", True)

# Turn living room 3 ON
# switch_set("living_room3", True)

# Turn kitchen OFF
# switch_set("kitchen", True)

# Read back status
# switch_status("living_room1")
# switch_status("living_room2")
# switch_status("living_room3")
# switch_status("kitchen")

# Example: Cool, Med fan, 23°C, Power ON
# ac_ir_full_command(mode=1, fan=2, temp=23, power_on=True)

# ===== Try it: power ON, Cool, 23°C, Medium fan =====
# ac_ir_scene_command(power=1, mode=1, temp=27, wind=2)

# ===== Try power OFF only =====
#ac_ir_scene_command(power=0)

# --- Using the New Relay Device ---
# switch_set("dual_relay", True, channel=1)
# switch_set("dual_relay", True, channel=2)

# Set Channel 1 to turn off in 30 minutes (1800s)
# relay_countdown("dual_relay", 1800, channel=1)

# Set relay to remember last state after power cut
# relay_power_strategy("dual_relay", "last")

# Read back full status of new device
#switch_status("dual_relay")
 
# ======== BOILER CONTROL FUNCTIONS ========

def boiler_set_power(on:bool, channel:int=1):
    """Turn boiler ON or OFF for specified channel."""
    did = DEVICES.get("boiler")
    if not did:
        print(f"❌ Boiler device not configured")
        return
    payload = {"commands": [{"code": _dp_code(channel), "value": bool(on)}]}
    resp = openapi.post(f"/v1.0/iot-03/devices/{did}/commands", payload)
    print(f"[BOILER ch{channel}] -> {'ON' if on else 'OFF'}")
    print(json.dumps(resp, ensure_ascii=False, indent=2))
    return resp

def boiler_set_timer(seconds:int, channel:int=1):
    """
    Set auto-shutoff timer for boiler (0-86400 seconds = 0-24 hours).
    seconds: Time in seconds after which boiler will automatically turn off
    channel: Boiler channel (1 or 2 if dual-channel)
    """
    did = DEVICES.get("boiler")
    if not did:
        print(f"❌ Boiler device not configured")
        return
    seconds = max(0, min(86400, int(seconds)))  # Clamp to 0-86400s
    payload = {"commands": [{"code": f"countdown_{channel}", "value": seconds}]}
    resp = openapi.post(f"/v1.0/iot-03/devices/{did}/commands", payload)
    hours = seconds // 3600
    mins = (seconds % 3600) // 60
    print(f"[BOILER ch{channel}] Auto-shutoff timer set: {hours}h {mins}m ({seconds}s)")
    print(json.dumps(resp, ensure_ascii=False, indent=2))
    return resp

def boiler_set_power_restore(mode:str):
    """
    Set boiler behavior after power outage.
    mode: 'power_off' (stay off), 'power_on' (turn on), 'last' (restore previous state)
    """
    did = DEVICES.get("boiler")
    if not did:
        print(f"❌ Boiler device not configured")
        return
    if mode not in ['power_off', 'power_on', 'last']:
        print(f"❌ Invalid mode. Must be: 'power_off', 'power_on', or 'last'")
        return
    payload = {"commands": [{"code": "relay_status", "value": mode}]}
    resp = openapi.post(f"/v1.0/iot-03/devices/{did}/commands", payload)
    print(f"[BOILER] Power restore strategy: {mode}")
    print(json.dumps(resp, ensure_ascii=False, indent=2))
    return resp

def boiler_set_indicator_light(mode:str):
    """
    Set boiler LED indicator behavior.
    mode: 'relay' (LED follows boiler state), 'pos' (always on), 'none' (always off)
    """
    did = DEVICES.get("boiler")
    if not did:
        print(f"❌ Boiler device not configured")
        return
    if mode not in ['relay', 'pos', 'none']:
        print(f"❌ Invalid mode. Must be: 'relay', 'pos', or 'none'")
        return
    payload = {"commands": [{"code": "light_mode", "value": mode}]}
    resp = openapi.post(f"/v1.0/iot-03/devices/{did}/commands", payload)
    print(f"[BOILER] Indicator light mode: {mode}")
    print(json.dumps(resp, ensure_ascii=False, indent=2))
    return resp

def boiler_set_child_lock(enabled:bool):
    """
    Enable or disable child lock on boiler switch (prevents physical button use).
    enabled: True to lock, False to unlock
    """
    did = DEVICES.get("boiler")
    if not did:
        print(f"❌ Boiler device not configured")
        return
    payload = {"commands": [{"code": "child_lock", "value": bool(enabled)}]}
    resp = openapi.post(f"/v1.0/iot-03/devices/{did}/commands", payload)
    print(f"[BOILER] Child lock: {'ENABLED ⚠️' if enabled else 'DISABLED'}")
    print(json.dumps(resp, ensure_ascii=False, indent=2))
    return resp

def boiler_set_cycle_schedule(cycle_config:str):
    """
    Set cycle timing schedule for boiler.
    cycle_config: String format (device-specific, check manufacturer docs)
    """
    did = DEVICES.get("boiler")
    if not did:
        print(f"❌ Boiler device not configured")
        return
    payload = {"commands": [{"code": "cycle_time", "value": str(cycle_config)}]}
    resp = openapi.post(f"/v1.0/iot-03/devices/{did}/commands", payload)
    print(f"[BOILER] Cycle schedule configured: {cycle_config}")
    print(json.dumps(resp, ensure_ascii=False, indent=2))
    return resp

def boiler_set_random_schedule(random_config:str):
    """
    Set random timing schedule for boiler (security/vacation mode).
    random_config: String format (device-specific, check manufacturer docs)
    """
    did = DEVICES.get("boiler")
    if not did:
        print(f"❌ Boiler device not configured")
        return
    payload = {"commands": [{"code": "random_time", "value": str(random_config)}]}
    resp = openapi.post(f"/v1.0/iot-03/devices/{did}/commands", payload)
    print(f"[BOILER] Random schedule configured: {random_config}")
    print(json.dumps(resp, ensure_ascii=False, indent=2))
    return resp

def boiler_set_inching_mode(inching_config:str):
    """
    Set inching/pulse mode for boiler (momentary activation).
    inching_config: String format (device-specific, check manufacturer docs)
    """
    did = DEVICES.get("boiler")
    if not did:
        print(f"❌ Boiler device not configured")
        return
    payload = {"commands": [{"code": "switch_inching", "value": str(inching_config)}]}
    resp = openapi.post(f"/v1.0/iot-03/devices/{did}/commands", payload)
    print(f"[BOILER] Inching mode configured: {inching_config}")
    print(json.dumps(resp, ensure_ascii=False, indent=2))
    return resp

def boiler_status():
    """Get current boiler device status (all channels and settings)."""
    did = DEVICES.get("boiler")
    if not did:
        print(f"❌ Boiler device not configured")
        return
    status = openapi.get(f"/v1.0/iot-03/devices/{did}/status")
    print(f"[BOILER] Current status:")
    print(json.dumps(status, ensure_ascii=False, indent=2))
    return status

# ======== BOILER USAGE EXAMPLES ========

# Turn boiler ON
boiler_set_power(True)

# Turn boiler OFF
# boiler_set_power(False)

# Set boiler to auto-shutoff after 1 hour (3600 seconds)
# boiler_set_timer(3600)

# Set boiler to auto-shutoff after 2 hours (7200 seconds)
# boiler_set_timer(7200)

# Set boiler to turn off after 30 minutes (1800 seconds)
# boiler_set_timer(1800)

# Configure boiler to remember last state after power outage
# boiler_set_power_restore("last")

# Configure boiler to always stay OFF after power outage (safety)
# boiler_set_power_restore("power_off")

# Set LED indicator to follow boiler state (on when boiler is on)
# boiler_set_indicator_light("relay")

# Turn off LED indicator completely
# boiler_set_indicator_light("none")

# Enable child lock to prevent accidental physical button presses
# boiler_set_child_lock(True)

# Disable child lock
# boiler_set_child_lock(False)

# Check current boiler status
# boiler_status()

# Advanced: Set cycle schedule (format depends on device)
# boiler_set_cycle_schedule("your_cycle_config_here")

# Advanced: Set random schedule for security/vacation mode
# boiler_set_random_schedule("your_random_config_here")

# Advanced: Configure inching/pulse mode
# boiler_set_inching_mode("your_inching_config_here")
