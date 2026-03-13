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
- **Replit Agent Assessment**: Moving to Replit Agent is **not recommended** for the GTM core build. While Replit is excellent for rapid prototyping (0 to 1), our current local + Vercel stack provides superior "Lab Mode" control over the specialized AI orchestration (OpenClaw) and technical SVG rendering required for Georgina's utility. 2026 GTM acceleration is found in stable local iteration, not autonomous agent hand-offs.
- **New URL**: https://workspace-three-self.vercel.app (Note: User prefers "Lab Mode" local development for now).
- **Recent Progress**: Built high-fidelity interactive SVG diagrams for Sediment Fences, Check Dams (SD 5-4), and Gully Pit Inlet Protection (SD 6-11). Added "Good vs Bad" Video Sandbox. Integrated full Blue Book Section 4 (Erosion Control: Management of Soils) into the module database and UI. Fixed multi-module UI logic to surface all available options in a category.
- **Pending**: Gmail OAuth for direct briefings.

## 2026-03-14 - Section 4 Integration & Multi-Module UI Fix
- **Blue Book Deep Dive**: Integrated complete Section 4 coverage into the Dynamic Assessor. This includes 4.1 (Principles), 4.2 (Planning), 4.3 (Handling Soils/Topsoil), and 4.4 (Erosion Hazard Assessment/Management).
- **Data Architecture**: Synchronized both `data.json` and the Prisma SQLite database (`dev.db`) to ensure Section 4 content is available across all environments.
- **UX Improvement**: Refined the conversational flow. When a user selects a category like "Erosion Control," Wolf now acknowledges multiple options (Section 4 Soil Management vs. Stockpile Management) instead of defaulting to a single choice.

