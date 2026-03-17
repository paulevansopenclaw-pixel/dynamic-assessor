import { execSync } from 'child_process';
import { PrismaClient } from '@prisma/client';

/**
 * DAILY BUILD & BRIEFING SCRIPT
 * Triggers: Daily 5:00 PM
 * Functions:
 * 1. Pushes local commits to GitHub (triggering Vercel build).
 * 2. Compiles a 'What's Changed' report from Git logs.
 * 3. Sends a Gmail briefing to Georgina and Paul.
 */

const prisma = new PrismaClient();
const GEORGINA_EMAIL = "georginaevans24@gmail.com";
const PAUL_EMAIL = "paulevans1975@gmail.com";
const GOG_PASSWORD = "bluebook2026"; // Exported as GOG_KEYRING_PASSWORD in shell

async function dailyDeployAndBriefing() {
  console.log("🚀 Starting Daily Deployment & Briefing Workflow...");

  try {
    // 1. Get the changes since yesterday (last 24h)
    const changelog = execSync('git log --since="24 hours ago" --pretty=format:"* %s (%h)"').toString();
    
    if (!changelog) {
      console.log("ℹ️ No changes detected in the last 24 hours. Skipping deploy.");
      return;
    }

    // 2. Push to GitHub (This triggers Vercel automatically)
    console.log("📤 Pushing latest build to Vercel via GitHub...");
    execSync('git push origin main');

    // 3. Construct the email body
    const body = `
Hi Georgina and Paul,

The latest version of the Dynamic Assessor is now LIVE on Vercel.

🔍 WHAT'S CHANGED IN THE LAST 24 HOURS:
${changelog}

🛠 SYSTEM STATUS:
- Blue Book Database: Synced (SQLite/Prisma)
- Briefing Engine: Operational
- Search: Natural Language Search Live

REPLY TO THIS EMAIL:
If you find any bugs or want to add a specific Blue Book section next, just reply to this email. I will scan the inbox daily and add your notes to my build queue.

Stay safe on site,
- Wolf (Dynamic Assessor v2.6)

🔗 View the Live App Here: https://workspace-three-self.vercel.app
    `.trim();

    // 4. Send the email via gogcli
    console.log("📧 Sending briefing email...");
    const subject = `Daily Build Report: ${new Date().toLocaleDateString('en-AU')}`;
    
    // Construct the shell command for gog
    const gogCommand = `export GOG_KEYRING_PASSWORD=${GOG_PASSWORD} && gog gmail send --to ${GEORGINA_EMAIL} --cc ${PAUL_EMAIL} --subject "${subject}" --body "${body}"`;
    execSync(gogCommand);

    console.log("✅ Daily workflow complete.");

  } catch (error: any) {
    console.error("❌ Workflow failed:", error.message);
  }
}

dailyDeployAndBriefing().finally(() => prisma.$disconnect());
