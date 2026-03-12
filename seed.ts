import { PrismaClient } from '@prisma/client'
import fs from 'fs'
import { fileURLToPath } from 'url'
import path from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const prisma = new PrismaClient()

async function main() {
  const dataPath = path.join(__dirname, 'src/app/data.json')
  const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'))

  console.log("Cleaning database...")
  await prisma.scenario.deleteMany()
  await prisma.module.deleteMany()

  console.log("Seeding V2 database...")
  for (const module of data.modules) {
    const createdModule = await prisma.module.create({
      data: {
        name: module.module_name,
        category: module.category || "Uncategorized",
        complianceAnchor: module.compliance_anchor,
      }
    })
    
    for (const scenario of module.scenarios) {
      await prisma.scenario.create({
        data: {
          symptoms: JSON.stringify(scenario.symptom),
          diagnosticQuestion: scenario.diagnostic_question,
          branches: JSON.stringify(scenario.branches),
          technicalSpecs: scenario.technical_specs || null,
          moduleId: createdModule.id
        }
      })
    }
  }
  console.log("V2 Database seeded successfully.")
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
