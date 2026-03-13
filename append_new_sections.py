import json

data_path = 'src/app/data.json'
with open(data_path, 'r') as f:
    data = json.load(f)

new_modules = [
  {
    "module_name": "Progressive_Rehabilitation",
    "category": "Planning",
    "compliance_anchor": "Landcom Blue Book Vol 1, 4th Edition - Section 4.3",
    "scenarios": [
      {
        "id": "pl_001",
        "symptom": ["large exposed earth areas", "no active works in area", "delayed stabilization"],
        "diagnostic_question": "Has the C-factor (soil cover) been established within the required timeframe after earthworks ceased?",
        "technical_specs": "Rehabilitation must achieve a C-factor of 0.1 (60% cover) within 20 days of inactivity.",
        "branches": {
          "exceeded_20_days": "Violation. You must apply temporary stabilization (e.g., polymer binders, hydromulch, or sterile cover crops) immediately to achieve 60% ground cover.",
          "under_20_days": "You are within the compliance window, but you must have a stabilization plan scheduled before the 20-day limit expires.",
          "cover_applied_but_thin": "If the cover is visibly thin, the C-factor is likely >0.1. Reapply seed/mulch to reach the 60% minimum coverage."
        }
      }
    ]
  },
  {
    "module_name": "Dewatering_Operations",
    "category": "Compliance",
    "compliance_anchor": "Landcom Blue Book Vol 1, 4th Edition - Section 6.3.3",
    "scenarios": [
      {
        "id": "cm_001",
        "symptom": ["pumping basin water", "discharging to stormwater", "turbid discharge"],
        "diagnostic_question": "Has the water been treated with a flocculant and tested for TSS/pH before discharging?",
        "technical_specs": "Discharge must be < 50mg/L TSS (or 30 NTU) and pH between 6.5 and 8.5.",
        "branches": {
          "untreated_and_untested": "STOP PUMPING. Immediate violation. Water must be dosed with Gypsum/PAC and allowed to settle before testing and discharge.",
          "treated_but_still_turbid": "The flocculant has not settled or the dose was incorrect. Do not discharge. Wait for settling or consult an engineer for re-dosing.",
          "tested_within_limits": "If TSS is <50mg/L and pH is 6.5-8.5, you may discharge. Ensure you are using a floating skimmer to avoid sucking sludge from the bottom."
        }
      }
    ]
  }
]

data["modules"].extend(new_modules)

with open(data_path, 'w') as f:
    json.dump(data, f, indent=2)

print("Planning and Compliance modules added successfully")
