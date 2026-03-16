import { db, sitesTable, incidentsTable, hazardsTable, nearMissesTable } from "@workspace/db";

function getRiskLevel(riskRating: number): string {
  if (riskRating <= 4) return "low";
  if (riskRating <= 9) return "medium";
  if (riskRating <= 16) return "high";
  return "extreme";
}

async function seed() {
  console.log("Seeding database...");

  const [site1] = await db.insert(sitesTable).values({ name: "Parramatta Metro Station", address: "Church St, Parramatta NSW 2150" }).returning();
  const [site2] = await db.insert(sitesTable).values({ name: "Sydney Olympic Park Redevelopment", address: "Olympic Blvd, Sydney Olympic Park NSW 2127" }).returning();
  const [site3] = await db.insert(sitesTable).values({ name: "WestConnex M8 Tunnel", address: "St Peters Interchange, St Peters NSW 2044" }).returning();

  console.log("Sites created:", site1.id, site2.id, site3.id);

  await db.insert(incidentsTable).values([
    {
      siteId: site1.id,
      title: "Worker slipped on wet concrete ramp",
      description: "Worker slipped on freshly poured concrete ramp near Level B2 entry. Sustained minor abrasion to right knee and palm. Area was not cordoned off and no wet floor signage was present.",
      incidentType: "injury",
      severity: "medium",
      status: "under_investigation",
      location: "Level B2 ramp access",
      reportedBy: "Tom Nguyen",
      dateOccurred: new Date("2026-03-10T08:30:00Z"),
      correctiveActions: "Wet floor signage deployed, area now cordoned during pour operations",
    },
    {
      siteId: site2.id,
      title: "Steel beam crane lift - near strike to overhead power line",
      description: "During lift of 8m steel I-beam, the beam swung and came within 600mm of energised 11kV overhead line. Spotter was not in position at time of incident.",
      incidentType: "near_miss",
      severity: "critical",
      status: "open",
      location: "Zone C eastern boundary",
      reportedBy: "Sarah Mitchell",
      dateOccurred: new Date("2026-03-12T11:15:00Z"),
    },
    {
      siteId: site3.id,
      title: "Excavator bucket struck underground gas service",
      description: "During bulk excavation works, excavator bucket made contact with unmarked gas service. Dial Before You Dig was completed but the service was not marked on drawings. No gas leak occurred.",
      incidentType: "property_damage",
      severity: "high",
      status: "closed",
      location: "Tunnel entry cut and cover section, CH 200+450",
      reportedBy: "Dave Kowalski",
      dateOccurred: new Date("2026-03-08T13:00:00Z"),
      correctiveActions: "Ground penetrating radar survey completed, all services potholed prior to excavation resuming",
    },
    {
      siteId: site1.id,
      title: "Eye injury from concrete splatter",
      description: "Worker received concrete splatter to left eye when compressed air hose was used to clean formwork. PPE (safety glasses) was not being worn at the time.",
      incidentType: "medical_treatment",
      severity: "medium",
      status: "closed",
      location: "Basement formwork area",
      reportedBy: "Kim Tran",
      dateOccurred: new Date("2026-03-05T09:45:00Z"),
      correctiveActions: "Toolbox talk delivered to all formwork crew regarding mandatory PPE. Safety glasses issued to all workers in zone.",
    },
  ]);

  console.log("Incidents created");

  const hz1Rating = 4 * 4;
  const hz2Rating = 3 * 3;
  const hz3Rating = 2 * 2;
  const hz4Rating = 5 * 4;
  const hz5Rating = 3 * 2;

  await db.insert(hazardsTable).values([
    {
      siteId: site2.id,
      title: "Overhead power lines within crane swing radius",
      description: "11kV energised overhead lines run across eastern boundary. Crane luffing operations at full radius could encroach on exclusion zone if operator is not briefed.",
      hazardType: "electrical",
      likelihood: 4,
      consequence: 4,
      riskRating: hz1Rating,
      riskLevel: getRiskLevel(hz1Rating),
      status: "open",
      location: "Eastern boundary, all lifts east of Grid H",
      reportedBy: "Sarah Mitchell",
    },
    {
      siteId: site3.id,
      title: "Diesel particulate exposure in confined tunnel headings",
      description: "Tunnelling operations using diesel-powered equipment. Air quality monitoring indicates CO levels approaching STEL limit during peak operations.",
      hazardType: "chemical",
      likelihood: 3,
      consequence: 3,
      riskRating: hz2Rating,
      riskLevel: getRiskLevel(hz2Rating),
      status: "actioned",
      location: "TBM heading, CH 200+100 to 200+300",
      reportedBy: "Greg Parsons",
      controlMeasures: "Additional forced ventilation installed, diesel vehicles restricted during peak workers-in-heading period",
    },
    {
      siteId: site1.id,
      title: "Manual handling – repetitive rebar tying",
      description: "Rebar tying crews performing highly repetitive wrist/hand movements for 6+ hour shifts. Risk of repetitive strain injury over extended works.",
      hazardType: "ergonomic",
      likelihood: 2,
      consequence: 2,
      riskRating: hz3Rating,
      riskLevel: getRiskLevel(hz3Rating),
      status: "open",
      location: "All reinforcement works",
      reportedBy: "Tom Nguyen",
    },
    {
      siteId: site3.id,
      title: "Unprotected excavation edge – risk of fall",
      description: "Cut and cover excavation 7m deep. Existing edge protection is temporary mesh only, no permanent barrier installed. Public footpath runs adjacent.",
      hazardType: "physical",
      likelihood: 5,
      consequence: 4,
      riskRating: hz4Rating,
      riskLevel: getRiskLevel(hz4Rating),
      status: "open",
      location: "Northern face, CH 200+380 to 200+420",
      reportedBy: "Dave Kowalski",
    },
    {
      siteId: site2.id,
      title: "Site dust – potential silica exposure during dry cutting",
      description: "Dry cutting of concrete blocks occurring without water suppression or local exhaust ventilation. Risk of crystalline silica inhalation.",
      hazardType: "chemical",
      likelihood: 3,
      consequence: 2,
      riskRating: hz5Rating,
      riskLevel: getRiskLevel(hz5Rating),
      status: "open",
      location: "Block wall construction area, Zone A",
      reportedBy: "James Okafor",
    },
  ]);

  console.log("Hazards created");

  await db.insert(nearMissesTable).values([
    {
      siteId: site1.id,
      title: "Unsecured tool dropped from scaffold – narrowly missed worker below",
      description: "A shifting spanner was dropped from Level 3 scaffold platform. It fell approximately 6m and landed 300mm from a worker on the ground who was not wearing a hard hat at that moment.",
      potentialConsequence: "Fatal or serious head injury if tool had struck worker",
      location: "Scaffold on north face, Level 3",
      reportedBy: "Marco Rossi",
      immediateActions: "Exclusion zone established below scaffold. All tools on platform to be tethered. Worker counselled on hard hat requirements.",
    },
    {
      siteId: site2.id,
      title: "Reversing truck – pedestrian worker in blind spot",
      description: "Delivery truck reversing to unloading bay. Worker on foot crossed the designated truck path. Truck driver not aware. Spotter was not in position.",
      potentialConsequence: "Crush injury or fatality from vehicle/pedestrian interaction",
      location: "Material laydown area, main site gate entrance",
      reportedBy: "Carla Wong",
      immediateActions: "Segregation barriers reinstalled. Spotter requirements enforced before any reversing movements.",
    },
  ]);

  console.log("Near misses created");
  console.log("Seed complete!");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
