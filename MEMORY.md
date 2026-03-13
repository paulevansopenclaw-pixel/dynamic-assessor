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
- **New URL**: https://workspace-three-self.vercel.app (Note: User prefers "Lab Mode" local development for now).
- **Recent Progress**: Built interactive SVG diagrams for Sediment Fences, Check Dams, and Inlet Protection. Added "Good vs Bad" Video Sandbox.
- **Pending**: Gmail OAuth for direct briefings; Replit Agent capability assessment.

## 2026-03-13 - Replit Agent Assessment & Technical Diagrams
- **GTM Strategy Assessment**: Evaluated Replit Agent vs. Current Local+Vercel stack. Replit Agent offers superior 0-to-1 speed and reduced infra-friction, but our current stack is better for the specialized Voice Competency hardware integration and existing Vercel pipeline. Recommended staying on Vercel for the core product but using Replit for rapid feature prototyping.
- **Technical Diagrams**: Built out Mermaid-based technical diagrams for 'Check Dams' and 'Inlet Protection' in `DIAGRAMS.md`. These align with Landcom Blue Book requirements for Georgina's project.
- **Project Expansion**: Added 'Check Dams' logic to the knowledge base, specifically focusing on height (500mm max) and spacing formulas based on slope.

