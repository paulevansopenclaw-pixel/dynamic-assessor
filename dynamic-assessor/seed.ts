import { PrismaClient } from '@prisma/client'
import data from './src/app/data.json'

const prisma = new PrismaClient()

async function main() {
  console.log("Cleaning database...")
  await prisma.scenario.deleteMany({})
  await prisma.module.deleteMany({})

  console.log("Seeding database with updated categories...")
  for (const module of data.modules) {
    const createdModule = await prisma.module.create({
      data: {
        name: module.module_name,
        category: module.category,
        complianceAnchor: module.compliance_anchor,
      }
    })
    
    for (const scenario of module.scenarios) {
      await prisma.scenario.create({
        data: {
          symptoms: JSON.stringify(scenario.symptom),
          diagnosticQuestion: scenario.diagnostic_question,
          branches: JSON.stringify(scenario.branches),
          technicalSpecs: (scenario as any).technical_specs || null,
          videoUrl: (scenario as any).video_url || null,
          moduleId: createdModule.id
        }
      })
    }
  }
  console.log("Database seeded successfully.")
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
