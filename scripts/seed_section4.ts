import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const blueBookSection4 = {
  name: "Erosion_Control_Management_of_Soils",
  category: "Erosion Control",
  complianceAnchor: "Landcom Blue Book Vol 1, 4th Edition - Section 4",
  scenarios: [
    {
      symptoms: JSON.stringify(["Introduction to Soil Management"]),
      diagnosticQuestion: "Are you familiar with the general principles of erosion control as outlined in Section 4.1?",
      technicalSpecs: "Erosion control is the first line of defense; sediment control is the last.",
      branches: JSON.stringify({
        need_overview: "Section 4.1 emphasizes that erosion control (preventing soil detachment) is more cost-effective than sediment control (capturing detached soil)."
      })
    },
    {
      symptoms: JSON.stringify(["Planning Considerations"]),
      diagnosticQuestion: "Does the project planning (4.2) account for soil characteristics and site constraints?",
      technicalSpecs: "Planning must occur before disturbance to minimize total site exposure.",
      branches: JSON.stringify({
        planning_details: "Section 4.2 requires staging works to minimize the area of soil exposed at any one time and scheduling works during periods of low erosivity where possible."
      })
    },
    {
      symptoms: JSON.stringify(["Handling Soils & General Guidelines"]),
      diagnosticQuestion: "Are you following the general erosion control guidelines (4.3.1) for soil handling?",
      technicalSpecs: "Disturb as little area as possible. Diversion banks should be used to isolate 'clean' water from 'dirty' sites.",
      branches: JSON.stringify({
        handling_guidelines: "Section 4.3.1 guidelines: 1. Minimise disturbance. 2. Divert run-on around the site. 3. Control runoff through the site."
      })
    },
    {
      symptoms: JSON.stringify(["Topsoil Handling Procedures"]),
      diagnosticQuestion: "How is the topsoil being managed according to Section 4.3.2?",
      technicalSpecs: "Topsoil must be stripped and stockpiled separately from subsoil. Max height for topsoil stockpiles: 2m.",
      branches: JSON.stringify({
        stripping_and_stockpiling: "Topsoil should be stripped from all areas to be disturbed and stockpiled separately. It must be protected from erosion by location, cover, or seeding.",
        stockpile_specs: "Topsoil stockpiles must be < 2m high to prevent anaerobic conditions. They must be located away from drainage lines and have sediment protection."
      })
    },
    {
      symptoms: JSON.stringify(["Assessment of Erosion Hazard"]),
      diagnosticQuestion: "Has an erosion hazard assessment (4.4.1) been conducted for the SWMP?",
      technicalSpecs: "Hazard is based on soil type, slope, and rainfall erosivity (R-factor).",
      branches: JSON.stringify({
        hazard_assessment: "Section 4.4.1 requires assessing the site's vulnerability. High hazard sites require more robust controls and frequent inspections."
      })
    },
    {
      symptoms: JSON.stringify(["Management of Sites of Erosion Hazard"]),
      diagnosticQuestion: "Is there a management plan (4.4.2) for identified high-hazard erosion sites?",
      technicalSpecs: "High-hazard areas require immediate stabilization and specific runoff controls.",
      branches: JSON.stringify({
        management_strategies: "For high-hazard sites, Section 4.4.2 mandates rapid progressive stabilization and the use of site-specific controls like rock-lined channels or polymer binders."
      })
    }
  ]
};

async function seed() {
  console.log("Seeding Section 4 into Prisma...");
  
  const createdModule = await prisma.module.create({
    data: {
      name: blueBookSection4.name,
      category: blueBookSection4.category,
      complianceAnchor: blueBookSection4.complianceAnchor,
      scenarios: {
        create: blueBookSection4.scenarios
      }
    }
  });

  console.log(`Seeded module: ${createdModule.name}`);
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
