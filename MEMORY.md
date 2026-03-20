# Paul's Project: The "Blue Book" Pivot
We are building the Dynamic Assessor app. It replaces the Landcom Bluebook with an AI Avatar (Wolf) that provides 60-second micro-training on Australian construction standards. It integrates with site access and verifies competency via voice conversations.

## The Vision & Context
- **The "Why"**: Bridge the gap between complex theoretical interests and practical utility. The app is a tangible result to show how high-level AI solves everyday site problems, specifically for Paul's wife to save her time and increase effectiveness.
- **The "Brick Wall"**: We are moving past a previous Replit build that hit a wall. Focus is now on getting a functional version "Live" while balancing future features.
- **The Relationship**: Paul is the Architect and Visionary. Wolf is the technical execution and high-energy development partner.

## Georgina's Project Requirements
- **Purpose**: Practical training for cadets/site personnel simplifying the Blue Book.
- **Structure**: Align with Blue Book sections (Planning, Erosion, Sediment, Maintenance, Compliance).
- **Navigation**: Search by specific control or problem.
- **Detail**: Practical steps + technical specs; embedded interactive diagrams.
- **Interactivity**: Decision trees, demonstration videos (Good vs Bad), voice competency verification.
- **Links**: Every scenario must link back to Blue Book references.

## Key Identifiers & Status
- **Current Stack**: Next.js, Prisma (SQLite), Tailwind, ElevenLabs, Google Imagen 4.
- **Replit Agent Assessment**: Moving to Replit Agent is **not recommended** for the GTM core build. While excellent for prototyping, it lacks the fine-grained control needed for our local AI orchestration (OpenClaw), custom SVG rendering, and specialized technical integrations. Our Local + Vercel stack is currently 2-3x faster for iterating on Georgina's complex requirements.
- **Recent Progress**: Built high-fidelity interactive SVG diagrams for Sediment Fences, Check Dams (SD 5-4), and Gully Pit Inlet Protection (SD 6-11). **Briefing Engine Live**: Connected to Gmail with Georgina (`georginaevans24@gmail.com`) and Paul (`paulevans1975@gmail.com`) as primary recipients. **Automated Workflow**: Set up daily 5:00 PM pushes to Vercel with automatic "What's Changed" briefing emails.
- **Pending**: Expanded Section 5 technical diagrams (Straw Bales SD 5-1, Earth Basins); Video demonstrating "Good vs Bad" stabilization.

## 2026-03-20 - Build Pivot: Proactive Prevention Focus
- **Strategic Direction**: Georgina has explicitly defined the core focus of the app: **Incident Prevention over Reporting**. The app must enable cadets to identify potential failures, provide the specific Blue Book requirements for repair/strengthening, and resolve the issue *before* it becomes an incident (e.g., basin flooding, fence collapse).
- **Technical Goal**: Move the 'Dynamic Assessor' from a reactive compliance tool to a proactive risk-management engine. This will include "Pre-emptive Triage" paths and "Control Strengthening" guidance in the next module build.
- **SME Top 3 Site Headaches (Georgina's Core Logic)**:
    1.  **Failing Controls / Lack of Understanding**: Personnel don't know what controls are, how they work, or how to maintain them. The app needs a "Verification & Maintenance" layer to check installation correctness and trigger proactive maintenance (e.g., cleaning before failure).
    2.  **Weather Event Prep (Heavy Rain)**: Need a "Storm-Ready" pre-warning system. The app should review the site plan and recommend specific Blue Book controls to check/reinforce *before, during, and after* an event to prevent critical failures like residential flooding. Includes recommending *additional* controls if current ones are at capacity.
    3.  **Dust / Wind Erosion Management**: Hot, windy conditions causing dust clouds due to too much exposed soil and lack of stabilization. The app must guide users to expected actions: stage works, deploy water carts, install temporary covers (hydromulch/binders), and begin progressive revegetation.
- **Weekend Build Goal**: Machine 2 (The Droid) will focus on building out proactive maintenance scenarios for these three headaches, moving the app into active site defense.

## 2026-03-18 - Dual-Mac Cluster Activation (The Handshake)
- **Machine 2 Online**: Successfully bridged the gap. Machine 2 is now active and monitoring the Blue Book build 24/7.
- **Vertex AI Activation**: Key `healthy-coil-490204-e9-76e32cfee9d6.json` successfully moved from Downloads to the workspace. Switching all Vision and Image Generation logic to the Vertex AI backbone for increased stability and regional control (Step 5 of `CLUSTER_SETUP.md`).
- **Strategic Split**: Machine 1 (this session) is now dedicated to the **Evans Moonshot Fund** and strategic advisory. Machine 2 handles the **Blue Book / Dynamic Assessor** build and technical execution.

## 2026-03-17 - Navigation & Triaging Flow Update
- **Triage Exit Option**: Added "None of these choices" to the symptom and branch selection steps.
- **Workflow Restart**: Selecting "None of these choices" now returns the user to the previous step (e.g., from symptoms back to modules, or from branches back to symptoms), allowing for a clean restart of the triage process.
- **Site Access Messaging Removed**: Per Georgina's latest feedback, removed all "Site Access" and "Pass Issued" messaging from the app.
- **Workflow Optimization**: Updated the resolution state to return the user directly to the main category selection page once an issue is finalized.

## 2026-03-14 - Google Workspace & Natural Language Search
- **Briefing Engine Live**: Successfully completed OAuth handshake for `paulevansopenclaw@gmail.com`. Wolf now has agentic access to Gmail, Drive, Sheets, and Calendar.
- **Natural Language Search**: Implemented a smart search bar in the UI. Users can now search by symptoms (e.g., "mud on road") or technical codes (e.g., "SD 6-11").
- **Section 4 Integration**: Full strategic planning and topsoil management depth added to the database.

