"use server";

export async function getModules() {
  return [
    {
      "id": "static_01",
      "module_name": "Erosion_Control_Management_of_Soils",
      "category": "Erosion Control",
      "compliance_anchor": "Landcom Blue Book Vol 1, 4th Edition - Section 4",
      "scenarios": [
        {
          "id": "ec_401",
          "symptom": ["Introduction to Soil Management"],
          "diagnostic_question": "Are you familiar with the general principles of erosion control as outlined in Section 4.1?",
          "technical_specs": "Erosion control is the first line of defense; sediment control is the last.",
          "branches": {
            "need_overview": "Section 4.1 emphasizes that erosion control is more cost-effective than sediment control."
          }
        }
      ]
    }
  ];
}
