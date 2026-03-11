import json

data_path = '/Users/openclaw/.openclaw/workspace/dynamic-assessor/src/app/data.json'
with open(data_path, 'r') as f:
    data = json.load(f)

new_modules = [
  {
    "module_name": "Stockpile_Management",
    "compliance_anchor": "Landcom Blue Book Vol 1, 4th Edition - Section 4.3.2",
    "scenarios": [
      {
        "id": "sp_001",
        "symptom": ["dust blowing off", "sediment washing into street", "stockpile bare"],
        "diagnostic_question": "Has this stockpile been inactive for more than 10 days, and is there a sediment fence installed on the downslope?",
        "branches": {
          "inactive_no_fence": "Violation. Stockpiles inactive for > 10 days must be covered or seeded, and must have a sediment fence on the downslope side. Fix immediately.",
          "active_no_fence": "Even if active, you must install a sediment fence 2 meters from the downslope base to catch runoff.",
          "inactive_with_fence": "Fence is good, but if it's inactive for > 10 days, you still need to apply a polymer dust binder or hydromulch to lock it down."
        }
      }
    ]
  },
  {
    "module_name": "Construction_Exits",
    "compliance_anchor": "Landcom Blue Book Vol 1, 4th Edition - Section 7.1.1",
    "scenarios": [
      {
        "id": "ce_001",
        "symptom": ["mud on the public road", "shaker pad blinded over", "trucks tracking dirt"],
        "diagnostic_question": "Is the exit aggregate clean and at least 200mm deep, or is it completely choked with mud?",
        "branches": {
          "choked_with_mud": "The shaker pad has failed. You must excavate the contaminated rock, lay a new geotextile base, and install fresh 50-75mm aggregate at least 200mm deep.",
          "clean_aggregate": "If the pad is clean but trucks are still tracking mud, you need to enforce the use of the high-pressure wash-down bay before they hit the aggregate.",
          "mud_on_road": "Stop operations. Deploy a street sweeper immediately. Mud on public roads is a major EPA fine."
        }
      }
    ]
  }
]

data["modules"].extend(new_modules)

with open(data_path, 'w') as f:
    json.dump(data, f, indent=2)

print("More modules added successfully")
