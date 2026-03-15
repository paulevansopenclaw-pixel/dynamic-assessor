"use server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function getModules() {
  try {
    const modules = await prisma.module.findMany({
      include: {
        scenarios: true,
      },
    });
    
    // Serialize back to match the old JSON structure so the UI works exactly the same
    return modules.map(mod => ({
      id: mod.id,
      module_name: mod.name,
      category: mod.category,
      compliance_anchor: mod.complianceAnchor,
      scenarios: mod.scenarios.map(sc => ({
        id: sc.id,
        symptom: JSON.parse(sc.symptoms),
        diagnostic_question: sc.diagnosticQuestion,
        branches: JSON.parse(sc.branches),
        technical_specs: sc.technicalSpecs,
        video_url: sc.videoUrl
      }))
    }));
  } catch (error) {
    console.error("Database error in getModules:", error);
    throw new Error("Failed to fetch modules from database");
  }
}
