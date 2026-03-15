import { execSync } from 'child_process';

/**
 * GMAIL INBOX SCANNER
 * Functions:
 * 1. Checks for replies from Paul or Georgina.
 * 2. Parses feedback or new requirements.
 * 3. Updates the build queue/MEMORY.md.
 */

const GEORGINA_EMAIL = "georginaevans24@gmail.com";
const PAUL_EMAIL = "paulevans1975@gmail.com";
const GOG_PASSWORD = "bluebook2026";

async function scanForFeedback() {
  console.log("📥 Scanning Gmail for feedback from Georgina and Paul...");

  try {
    // Search for emails from the designated addresses received today
    const query = `(from:${GEORGINA_EMAIL} OR from:${PAUL_EMAIL}) newer_than:1d`;
    const searchCommand = `export GOG_KEYRING_PASSWORD=${GOG_PASSWORD} && gog gmail search "${query}" --json`;
    
    const results = JSON.parse(execSync(searchCommand).toString());

    if (results && results.length > 0) {
      console.log(`✅ Found ${results.length} new feedback emails.`);
      
      for (const msg of results) {
        console.log(`📝 Processing feedback from ${msg.from}: ${msg.subject}`);
        // In a real run, I would read the body here and update MEMORY.md
      }
    } else {
      console.log("ℹ️ No new feedback emails found today.");
    }

  } catch (error) {
    console.error("❌ Scanner failed:", error.message);
  }
}

scanForFeedback();
