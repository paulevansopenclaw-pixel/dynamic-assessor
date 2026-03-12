import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { moduleName, issue, answer } = await req.json();
    const slackWebhookUrl = process.env.SLACK_WEBHOOK_URL;

    const payload = {
      text: `🚨 *Dynamic Assessor Alert: Competency Failure* 🚨\n*Module:* ${moduleName}\n*Issue Identified:* ${issue}\n*Worker Action:* Selected a failing or critical action path.\n*System Response:* ${answer}`
    };

    if (!slackWebhookUrl) {
      // If no webhook URL is set, we just log it locally
      console.log("\n--- SLACK ALERT MOCKED ---");
      console.log(payload.text);
      console.log("--------------------------\n");
      return NextResponse.json({ success: true, mocked: true });
    }

    // Fire the real payload to Slack
    const response = await fetch(slackWebhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      console.error("Slack API Error:", await response.text());
      return NextResponse.json({ error: "Slack delivery failed" }, { status: response.status });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Server Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
