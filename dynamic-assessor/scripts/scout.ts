import * as cheerio from 'cheerio';
import * as fs from 'fs';

// Target URL for NSW EPA or Landcom 'Managing Urban Stormwater' (The Bluebook)
const COMPLIANCE_URL = 'https://www.environment.nsw.gov.au/research-and-publications/publications-search/managing-urban-stormwater-soils-and-construction-volume-1-4th-editon';
const LAST_CHECK_FILE = './scripts/last_compliance_state.json';
const SLACK_WEBHOOK_URL = process.env.SLACK_WEBHOOK_URL;

async function checkComplianceUpdates() {
  console.log(`\n🔍 [THE SCOUT] Deploying to monitor NSW EPA Compliance Guidelines: ${COMPLIANCE_URL}...`);
  
  try {
    const response = await fetch(COMPLIANCE_URL);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    
    const html = await response.text();
    const $ = cheerio.load(html);
    
    // Look for mentions of the Blue Book, revisions, or updates
    const updates: string[] = [];
    $('p, li, a').each((_, el) => {
      const text = $(el).text().trim().toLowerCase();
      if (text.includes('blue book') || text.includes('managing urban stormwater') || text.includes('revised edition')) {
        // Collect sentences that might indicate an update
        updates.push($(el).text().trim().replace(/\s+/g, ' '));
      }
    });

    // Hash the results to see if the page has materially changed since last week
    const currentStateHash = Buffer.from(updates.join('')).toString('base64');
    
    let previousState = { hash: '', date: '' };
    if (fs.existsSync(LAST_CHECK_FILE)) {
      previousState = JSON.parse(fs.readFileSync(LAST_CHECK_FILE, 'utf-8'));
    }

    if (currentStateHash !== previousState.hash && previousState.hash !== '') {
      console.log(`\n🚨 [ALERT] The Scout detected a change on the NSW EPA Bluebook page!`);
      // Trigger Slack Alert
      if (SLACK_WEBHOOK_URL) {
        await fetch(SLACK_WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text: `🔔 *Compliance Scout Alert*\nA change has been detected on the NSW EPA Stormwater Management page.\n*Check the guidelines:* ${COMPLIANCE_URL}`
          })
        });
      }
    } else {
      console.log(`\n✅ [CLEAR] No regulatory changes detected. The Bluebook database is up to date.`);
    }

    // Save the new state
    fs.writeFileSync(LAST_CHECK_FILE, JSON.stringify({
      date: new Date().toISOString(),
      hash: currentStateHash,
      matches_found: updates.length
    }, null, 2));

    console.log(`[THE SCOUT] Return to base. Report filed at ${LAST_CHECK_FILE}\n`);

  } catch (error) {
    console.error(`❌ [THE SCOUT] Encountered an error while scraping:`, error);
  }
}

checkComplianceUpdates();