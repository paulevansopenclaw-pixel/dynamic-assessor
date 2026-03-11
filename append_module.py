import json

data_path = '/Users/openclaw/.openclaw/workspace/dynamic-assessor/src/app/data.json'
with open(data_path, 'r') as f:
    data = json.load(f)

new_module = {
  "module_name": "Sediment_Basin_Management",
  "compliance_anchor": "Landcom Blue Book Vol 1, 4th Edition - Section 6.3.3",
  "scenarios": [
    {
      "id": "sb_001",
      "symptom": ["basin is full of water", "water not dropping", "needs dewatering"],
      "diagnostic_question": "Has it been more than 5 days since the rain stopped, and what is the current Total Suspended Solids (TSS) level?",
      "branches": {
        "less_than_50mg_L": "If TSS is under 50mg/L, you are clear to pump out or discharge the water to the designated outlet.",
        "more_than_50mg_L": "The water is still turbid. You must treat it with a flocculant (like Gypsum) and wait for the sediment to settle before discharging.",
        "raining_currently": "Do not dewater during an active rainfall event unless directed by the site engineer."
      }
    },
    {
      "id": "sb_002",
      "symptom": ["sediment buildup", "basin looks shallow"],
      "diagnostic_question": "Is the accumulated sediment level above the marked design capacity peg (usually 30% of total volume)?",
      "branches": {
        "above_the_peg": "The basin capacity is compromised. You need to excavate the settled sediment and dispose of it in an approved stockpile area immediately.",
        "below_the_peg": "The basin is still within operational capacity, but monitor the sediment level after the next rain event."
      }
    }
  ]
}

data["modules"].append(new_module)

with open(data_path, 'w') as f:
    json.dump(data, f, indent=2)

print("Module added successfully")
