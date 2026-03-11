import { PrismaClient } from '@prisma/client'
import data from './src/app/data.json'

const prisma = new PrismaClient()

async function main() {
  console.log("Seeding database...")
  for (const module of data.modules) {
    const createdModule = await prisma.module.create({
      data: {
        name: module.module_name,
        complianceAnchor: module.compliance_anchor,
      }
    })
    
    for (const scenario of module.scenarios) {
      await prisma.scenario.create({
        data: {
          symptoms: JSON.stringify(scenario.symptom),
          diagnosticQuestion: scenario.diagnostic_question,
          branches: JSON.stringify(scenario.branches),
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
