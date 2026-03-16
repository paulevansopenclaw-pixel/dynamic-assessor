export type ControlCategory =
  | "Working at Heights"
  | "Excavation"
  | "Electrical"
  | "Plant & Equipment"
  | "Traffic & Access"
  | "Fire & Emergency"
  | "PPE"
  | "Hazardous Materials"
  | "Confined Spaces"
  | "General";

export type ControlStatus = "missing" | "damaged" | "not_functioning";

export interface ControlMeasure {
  id: string;
  name: string;
  category: ControlCategory;
  description: string;
  mustDo: string[];
  signsOfFailure: string[];
  immediateActions: string[];
  reinstatementRequired: string[];
  stopWorkTrigger: string;
  referenceSection: string;
  referenceDoc: string;
}

export const CONTROLS: ControlMeasure[] = [
  // ─── WORKING AT HEIGHTS ───────────────────────────────────────────────────
  {
    id: "edge-protection",
    name: "Edge Protection / Perimeter Barriers",
    category: "Working at Heights",
    description: "Physical barriers installed at open edges, voids, or floor penetrations to prevent falls from height.",
    mustDo: [
      "Withstand a force of at least 600N applied at the top rail in any direction",
      "Top rail 900mm–1100mm above the working surface",
      "Mid rail at approximately mid-height between top rail and toe board",
      "Toe board minimum 150mm high to prevent tools/materials rolling off",
      "No gap greater than 450mm between rails (prevents body passing through)",
      "Installed before work commences at that edge",
    ],
    signsOfFailure: [
      "Missing, removed, or displaced sections of rail",
      "Bent, cracked, or otherwise structurally compromised rails or posts",
      "Posts loose in base plates or not properly secured",
      "Gaps in the barrier exceeding 450mm",
      "Toe board absent or below 150mm",
      "Top rail below 900mm or above 1100mm",
      "Barrier on one side only of a penetration (must be all four sides)",
    ],
    immediateActions: [
      "Stop all work within 2m of the unprotected edge immediately",
      "Cordon off the area with tape/bunting and signage: DANGER — UNPROTECTED EDGE",
      "Notify the supervisor and site manager immediately",
      "Assess whether other workers in the area need to be moved",
      "Do not proceed until compliant edge protection is reinstated",
    ],
    reinstatementRequired: [
      "Full barrier system reinstated to meet all specification requirements",
      "Top rail, mid rail, and toe board all present and secure",
      "Visually inspect every post base — all must be fixed and plumb",
      "Walk the entire barrier run to confirm no gaps > 450mm",
      "Supervisor sign-off on inspection before work at height resumes",
    ],
    stopWorkTrigger:
      "Any open edge or void at 2m or more height without compliant edge protection in place. Work must stop immediately and not resume until reinstated.",
    referenceSection: "Section 4.2 — Fall Prevention",
    referenceDoc: "SafeWork Australia: Construction Work Code of Practice (2018)",
  },
  {
    id: "scaffolding",
    name: "Scaffolding (Prefabricated / Tube & Coupler)",
    category: "Working at Heights",
    description: "Temporary elevated work platforms used to provide safe access and working positions during construction.",
    mustDo: [
      "Erected, altered, and dismantled only by a licensed scaffolder (scaffold > 4m)",
      "Safe Work Method Statement (SWMS) in place before erection",
      "Maximum platform gap between boards: 25mm for general, 12mm if < 2m above ground",
      "Planks/boards must extend past the support by 150–300mm (or be cleated)",
      "All working platforms ≥ 450mm wide",
      "Scaffold tied to structure as per design (every 4m vertically, 6m horizontally as minimum)",
      "Ladder access or stair access provided — not climbing scaffold frames",
      "Inspected by competent person: on erection, after alteration, after any storm/event",
    ],
    signsOfFailure: [
      "Missing ties, couplers, or braces",
      "Bent or cracked standards, ledgers, or transoms",
      "Displaced or missing planks, gaps in platform > 25mm",
      "No edge protection on the working platform",
      "Scaffold leaning, out of plumb, or appears unstable",
      "Base plates missing, on unstable ground, or not properly adjusted",
      "Scaffold tag missing, out of date, or showing RED (do not use)",
    ],
    immediateActions: [
      "Do NOT use the scaffold — stop work immediately",
      "Erect danger tape around the base of all access points with signage: SCAFFOLD UNSAFE — DO NOT USE",
      "Notify supervisor and the licensed scaffolder responsible",
      "Ensure nobody is on or accesses the scaffold until inspected",
      "Do not attempt to make repairs unless you are a licensed scaffolder",
    ],
    reinstatementRequired: [
      "Licensed scaffolder to inspect and repair all defects",
      "Scaffold tag updated to GREEN with new inspection date and scaffolder's name",
      "Supervisor review of scaffold tag before any workers access",
      "If scaffold was significantly altered, re-erection inspection required",
    ],
    stopWorkTrigger:
      "Any scaffold without a current GREEN tag, showing visible structural damage, missing ties, or missing platform planks. Nobody may access until licensed scaffolder has cleared it.",
    referenceSection: "Section 4.3 — Scaffolding",
    referenceDoc: "SafeWork Australia: Construction Work Code of Practice (2018)",
  },
  {
    id: "safety-harness",
    name: "Safety Harness & Fall Arrest System",
    category: "Working at Heights",
    description: "Full body harness, lanyards, energy absorbers, and anchor points used where edge protection is not practicable.",
    mustDo: [
      "Compliant to AS/NZS 1891 series",
      "Worn correctly — all straps adjusted, chest strap at sternum level",
      "Attached to an engineered anchor point rated for fall arrest (min 12kN for single person)",
      "Lanyard/energy absorber appropriate for the fall distance — total fall distance calculated",
      "Pre-use inspection carried out before every use (harness, lanyard, karabiner, anchor)",
      "Harness inspected by competent person at minimum every 6 months, with record kept",
      "Rescue plan in place before use — suspended worker rescue to occur within 15 minutes",
    ],
    signsOfFailure: [
      "Cuts, fraying, chemical damage, heat damage on webbing",
      "Bent, cracked, or corroded buckles, D-rings, or karabiners",
      "Karabiner gate not locking or closing properly",
      "Energy absorber deployed (bright coloured tape inside pack visible)",
      "Harness stitching pulled, unravelling, or missing stitches",
      "No inspection tag or tag out of date",
      "Anchor point damaged, loose, or not rated for fall arrest",
    ],
    immediateActions: [
      "Take the defective equipment out of service immediately",
      "Tag it with a DANGER tag: DO NOT USE",
      "Do not use it for any purpose — quarantine it away from the kit",
      "Notify the supervisor",
      "Do not work at height using that equipment until replacement issued",
      "If anchor point is suspect, stop all work using that anchor and notify supervisor",
    ],
    reinstatementRequired: [
      "Replace harness/lanyard with an in-date, undamaged unit",
      "New unit must have current inspection record",
      "Anchor point assessed by structural/rigging engineer if any doubt",
      "Competent person pre-use inspection of new equipment before use",
      "Rescue plan must be reviewed to confirm it is still valid for the new setup",
    ],
    stopWorkTrigger:
      "No compliant anchor point available, or no serviceable harness/lanyard available where working at height without edge protection. Work at height cannot proceed.",
    referenceSection: "Section 4.4 — Safety Harnesses",
    referenceDoc: "SafeWork Australia: Construction Work Code of Practice (2018) / AS/NZS 1891",
  },

  // ─── EXCAVATION ──────────────────────────────────────────────────────────
  {
    id: "excavation-shoring",
    name: "Excavation Shoring / Benching / Battering",
    category: "Excavation",
    description: "Ground support systems (shoring, benching, or battering/sloping) used to prevent collapse of excavation walls.",
    mustDo: [
      "All excavations ≥ 1.5m deep must have a ground support system unless engineered assessment confirms stability",
      "Shoring to be designed by a geotechnical engineer or conform to the prescriptive tables for the soil type",
      "Surcharge loads (plant, spoil, materials) kept minimum 1m away from the edge (further if specified in design)",
      "Excavation inspected by a competent person before each work shift and after any rain event",
      "Services (gas, electrical, water, comms) identified, potholed, and marked before any excavation",
      "Emergency egress (ladder) within every 9m of workers in the excavation",
    ],
    signsOfFailure: [
      "Visible cracking in ground near the edge (tension cracks running parallel to the excavation)",
      "Any movement or deflection of shoring components",
      "Water infiltration softening the excavation walls",
      "Spoil or material within 1m of the edge causing surcharge",
      "Bolts/pins missing from shoring panels",
      "Benching steps eroding, crumbling, or showing tension cracks",
    ],
    immediateActions: [
      "All workers exit the excavation immediately — do not delay",
      "Establish a 2m exclusion zone around the entire excavation",
      "Notify the supervisor and geotechnical/design engineer",
      "Do not attempt to repair shoring while workers are in the excavation",
      "Pump out any water accumulation causing softening",
      "Do not allow plant to approach the edge",
    ],
    reinstatementRequired: [
      "Geotechnical or structural engineer inspects and signs off before re-entry",
      "All defects in shoring repaired per the original design",
      "New inspection record completed",
      "Competent person re-inspects before every shift following the event",
    ],
    stopWorkTrigger:
      "Any signs of ground movement, tension cracking, shoring movement, or water infiltration. All workers must exit immediately. Excavation cannot be re-entered until engineer clears it.",
    referenceSection: "Section 7 — Excavation Work",
    referenceDoc: "SafeWork Australia: Construction Work Code of Practice (2018)",
  },
  {
    id: "trench-barriers",
    name: "Trench / Excavation Edge Barricading",
    category: "Excavation",
    description: "Barriers and signage around excavations to prevent falls by workers and the public.",
    mustDo: [
      "Physical barrier around entire perimeter of excavation",
      "Barrier must prevent pedestrians from inadvertently approaching the edge",
      "Minimum 1m setback from the edge unless shoring/edge protection extends to the barrier",
      "Signage: DANGER EXCAVATION at all public-facing sides",
      "Lighting of barriers after dark if site is accessible after hours",
    ],
    signsOfFailure: [
      "Barriers displaced, knocked over, or with large gaps",
      "Signage blown away or obscured",
      "No barriers on any side of the excavation",
      "Barriers too close to edge (less than 1m without edge protection)",
    ],
    immediateActions: [
      "Re-establish barriers to full perimeter immediately",
      "Place additional weight/sandbags on barrier feet to prevent displacement",
      "Notify supervisor and record the deficiency",
    ],
    reinstatementRequired: [
      "Full perimeter barrier in place with signage visible from all approach directions",
      "Supervisor inspection before public access in adjacent areas resumes",
    ],
    stopWorkTrigger:
      "No barriers around an excavation in a public access area. Stop work and re-establish barriers before the area is accessible again.",
    referenceSection: "Section 7.3 — Preventing Falls into Excavations",
    referenceDoc: "SafeWork Australia: Construction Work Code of Practice (2018)",
  },

  // ─── ELECTRICAL ─────────────────────────────────────────────────────────
  {
    id: "rcd",
    name: "Residual Current Device (RCD / Safety Switch)",
    category: "Electrical",
    description: "RCDs detect earth leakage current and cut power within 30ms to prevent electrocution. Mandatory on all portable tools and leads on construction sites.",
    mustDo: [
      "All portable electrical tools and extension leads must be protected by an RCD rated ≤ 30mA trip threshold",
      "RCDs must be tested monthly using the test button and current injection tested quarterly (recorded in a register)",
      "RCDs must be tagged with the test date and tester's name",
      "Any RCD that trips must not be reset until the cause has been identified and rectified",
      "Must be installed at the point of supply (not at the end of a long lead run)",
    ],
    signsOfFailure: [
      "RCD test button has not been tested (no test date tag, or tag overdue)",
      "RCD trips repeatedly when reset",
      "Physical damage to the RCD casing",
      "RCD is in a distribution board but the lead runs extend beyond it without additional RCD protection",
      "RCD is not rated ≤ 30mA (some old units are 100mA — not acceptable on site)",
    ],
    immediateActions: [
      "Isolate the circuit immediately — switch off and remove from service",
      "Tag out the RCD: DANGER — OUT OF SERVICE, date and your name",
      "Do not use any electrical equipment on that circuit until RCD is tested/replaced",
      "Notify the supervisor and site electrician",
      "If the RCD tripped without explanation, treat the lead/tool as faulty until tested by a licensed electrician",
    ],
    reinstatementRequired: [
      "Licensed electrician to test and certify the RCD",
      "Tag updated with test date, result, and electrician's signature",
      "Root cause of any nuisance tripping identified and rectified before resetting",
      "Current injection test result recorded in the electrical register",
    ],
    stopWorkTrigger:
      "No RCD protection available for portable tools. All power tool use must cease until compliant RCD protection is available.",
    referenceSection: "Section 9.3 — Residual Current Devices",
    referenceDoc: "SafeWork Australia: Construction Work Code of Practice (2018) / AS/NZS 3012",
  },
  {
    id: "electrical-isolation",
    name: "Electrical Isolation / Lockout–Tagout (LOTO)",
    category: "Electrical",
    description: "Procedures and physical locks used to ensure electrical plant and equipment cannot be energised during maintenance or repair work.",
    mustDo: [
      "Isolation carried out by a licensed electrician for all HV work and for any work inside a switchboard",
      "Each worker places their personal lock on the isolation device — multi-hasp used if multiple workers",
      "Each isolation point tagged with DANGER tag: DO NOT ENERGISE, name, date, contact",
      "Prove dead: use an approved voltage tester at the point of work before touching any conductor",
      "Capacitors discharged and stored energy dissipated before work begins",
      "Test the tester before and after testing (use a known live source to confirm tester is working)",
    ],
    signsOfFailure: [
      "Isolation point has no lock or tag in place during maintenance",
      "Only a tag in place — no physical lock (tag alone is not adequate)",
      "Worker has not applied their own personal lock — relying on another person's lock",
      "Isolation point is accessible to others who may not know work is in progress",
      "Voltage not tested at point of work after isolation",
    ],
    immediateActions: [
      "Stop all work on the electrical equipment immediately",
      "If you cannot determine whether the equipment is isolated — treat it as live",
      "Apply your personal LOTO immediately before any further work",
      "Notify the supervisor",
      "If the equipment energised during work — treat as a serious incident, evacuate the area, call emergency services if any injury",
    ],
    reinstatementRequired: [
      "All personal locks and tags removed by the workers who applied them",
      "Area confirmed clear of all workers and tools before re-energising",
      "Licensed electrician re-energises for electrical work",
      "Function test of equipment before returning to service",
    ],
    stopWorkTrigger:
      "Electrical work on any energised equipment without proper isolation and personal LOTO in place. Stop immediately.",
    referenceSection: "Section 9.2 — Electrical Safety",
    referenceDoc: "SafeWork Australia: Construction Work Code of Practice (2018) / AS/NZS 4836",
  },

  // ─── PLANT & EQUIPMENT ──────────────────────────────────────────────────
  {
    id: "plant-guarding",
    name: "Plant Guarding (Mechanical Guards & Covers)",
    category: "Plant & Equipment",
    description: "Physical guards that prevent contact with dangerous parts of rotating or moving plant (blades, drive shafts, belts, pulleys, nip points).",
    mustDo: [
      "Guards in place on all dangerous parts as specified in the plant's design documentation",
      "Guards must not be removed while plant is operating or capable of being started",
      "Fixed guards require a tool to remove (they do not rely on the worker's decision)",
      "Interlocked guards stop the plant when the guard is opened",
      "Guards maintained in good condition — no missing fasteners, cracks, or broken interlocks",
      "Plant cannot operate in an unguarded state",
    ],
    signsOfFailure: [
      "Guard missing, removed, or propped open",
      "Guard damaged (bent, cracked, not fully covering the hazardous parts)",
      "Fasteners missing from guard — guard held in place only loosely",
      "Interlock bypassed (wire tied, taped over, or otherwise defeated)",
      "Drive belts, blades, or rotating parts accessible without a tool",
    ],
    immediateActions: [
      "Shut down the plant immediately using the E-stop or main isolator",
      "Lockout / tagout the plant — DANGER: PLANT UNSAFE — DO NOT START",
      "Notify the supervisor and plant mechanic/service provider",
      "Do not restart plant until all guards are in place and serviceable",
      "Do not bypass interlock or operate without a guard under any circumstances",
    ],
    reinstatementRequired: [
      "All guards reinstated and fastened with correct hardware",
      "Interlocks tested and confirmed operational",
      "Plant mechanic or competent person signs off on plant inspection record",
      "Pre-start checklist completed before first operation",
    ],
    stopWorkTrigger:
      "Plant operating without guards, or guards that are bypassed or defeated. Plant must be shut down and locked out immediately.",
    referenceSection: "Section 11.2 — Plant Guarding",
    referenceDoc: "SafeWork Australia: Construction Work Code of Practice (2018) / AS 4024",
  },
  {
    id: "plant-prestart",
    name: "Plant Pre-Start Inspection",
    category: "Plant & Equipment",
    description: "Documented daily check of mobile plant (excavators, cranes, forklifts, EWPs, compactors) before each shift's operation.",
    mustDo: [
      "Operator completes pre-start checklist before operating plant each shift",
      "Checks include: brakes, steering, lights, horn, mirrors, seat belt, E-stop, tyres, fluid levels, guarding, attachments",
      "Any defect identified must be recorded and reported to the supervisor",
      "Plant with a safety-critical defect must be taken out of service immediately — not used until defect rectified",
      "Pre-start record to be kept on the plant or in the site register",
    ],
    signsOfFailure: [
      "No pre-start checklist completed for the current shift",
      "Known defects not recorded on the form",
      "Plant operating with a recorded unresolved safety defect",
      "Checklist signed but clearly not completed (e.g. all boxes ticked in seconds)",
    ],
    immediateActions: [
      "Stop the plant and request the operator complete the pre-start checklist",
      "If a safety defect exists: shut down plant, lock out, notify supervisor",
      "Do not allow plant to continue operating without a completed checklist",
    ],
    reinstatementRequired: [
      "Pre-start completed and defects noted",
      "Safety-critical defects rectified and verified by mechanic or supervisor",
      "Updated checklist completed before return to service",
    ],
    stopWorkTrigger:
      "Any safety-critical defect identified (e.g. no brakes, no E-stop, missing guarding). Plant must not operate until defect is rectified.",
    referenceSection: "Section 11.3 — Managing Plant",
    referenceDoc: "SafeWork Australia: Construction Work Code of Practice (2018)",
  },

  // ─── TRAFFIC & ACCESS ──────────────────────────────────────────────────
  {
    id: "traffic-management",
    name: "Traffic Management Plan Controls",
    category: "Traffic & Access",
    description: "Physical controls on the Traffic Management Plan (TMP) — barriers, signage, speed limits, spotters — that separate plant from pedestrian workers.",
    mustDo: [
      "Approved Traffic Management Plan in place before any works affecting traffic or pedestrians",
      "Physical separation between plant movement areas and pedestrian walkways at all times",
      "Signage erected as per the TMP layout drawings",
      "Spotter (Dogman/Traffic Controller) in position whenever plant is reversing or working near workers/public",
      "Speed limit of 10km/h within construction sites unless TMP specifies lower",
      "All workers and visitors to enter/exit via designated pedestrian gates only",
    ],
    signsOfFailure: [
      "Barriers displaced — pedestrian path now overlaps plant movement area",
      "Signage blown over, obscured, or missing",
      "Spotter absent during reversing operations",
      "Workers taking shortcuts through plant areas",
      "Temporary pedestrian route not adequately lit at night",
    ],
    immediateActions: [
      "Halt all plant movement in the affected area immediately",
      "Physically redirect pedestrians away from the unsupported area",
      "Re-establish barriers and signage to match TMP layout",
      "Station a person to control the area manually until controls are reinstated",
      "Notify supervisor and Traffic Controller",
    ],
    reinstatementRequired: [
      "Barriers and signage reinstated to exactly match the approved TMP",
      "Traffic Controller confirms controls are in place before plant movements resume",
      "Brief all workers on the change if a deviation from TMP has been made",
      "TMP updated and re-approved if layout has changed permanently",
    ],
    stopWorkTrigger:
      "Any situation where there is no physical separation between plant and pedestrians, or no spotter during reversing. Plant must stop immediately.",
    referenceSection: "Section 10 — Traffic Management",
    referenceDoc: "SafeWork Australia: Construction Work Code of Practice (2018) / AS 1742.3",
  },

  // ─── FIRE & EMERGENCY ──────────────────────────────────────────────────
  {
    id: "fire-extinguisher",
    name: "Portable Fire Extinguisher",
    category: "Fire & Emergency",
    description: "Portable fire suppression equipment available for first-attack firefighting on construction sites.",
    mustDo: [
      "At least one extinguisher within 15m travel distance of any work area",
      "Extinguisher type appropriate for the fire risk (e.g. ABE powder, CO₂ near electrical)",
      "Annual service completed — service tag attached with date and provider",
      "Monthly visual inspection completed — pressure gauge in green zone, pin in place, no visible damage",
      "Mounted accessibly — not blocked by materials, at least 1m clearance from hot works areas",
      "Workers in the area trained in use (annual refresher recommended)",
    ],
    signsOfFailure: [
      "Service tag missing, out of date (> 12 months), or damaged",
      "Pressure gauge outside green zone (over- or under-pressured)",
      "Safety pin missing or tamper seal broken without documented use",
      "Extinguisher body visually damaged, dented, or corroded",
      "Hose/horn cracked or missing",
      "Extinguisher has been used and not recharged",
      "Extinguisher blocked by materials — not immediately accessible",
    ],
    immediateActions: [
      "Remove the defective extinguisher from service",
      "Tag it: OUT OF SERVICE and relocate it away from the work area",
      "Immediately source a serviceable replacement and place it within 15m of the work area",
      "If no replacement is available, notify supervisor — hot works and activities with fire risk must cease",
      "Notify the site WHS officer to arrange emergency service",
    ],
    reinstatementRequired: [
      "Extinguisher recharged and re-serviced by a licensed fire protection provider",
      "New service tag attached with current date",
      "Pressure gauge re-confirmed in green zone",
      "Extinguisher returned to its designated position and unobstructed",
    ],
    stopWorkTrigger:
      "No serviceable fire extinguisher within 15m during hot works (grinding, welding, cutting, use of flammables). Hot works must cease until serviceable extinguisher is in place.",
    referenceSection: "Section 14.2 — Fire Safety",
    referenceDoc: "SafeWork Australia: Construction Work Code of Practice (2018) / AS 1851",
  },

  // ─── PPE ────────────────────────────────────────────────────────────────
  {
    id: "hard-hat",
    name: "Hard Hat (Safety Helmet)",
    category: "PPE",
    description: "Head protection against falling objects, striking hazards, and electrical hazards on construction sites.",
    mustDo: [
      "Compliant to AS/NZS 1801 — look for the stamp on the inside of the shell",
      "Harness assembly in good condition — not frayed, cracked, or missing rivets",
      "Shell free from cracks, gouges, and significant scratches",
      "Replaced after any significant impact — even if no visible damage (internal fractures)",
      "Replaced after 3 years from manufacture date (stamped inside shell) or 2 years from first use, whichever comes first",
      "Worn whenever on site or where there is risk of head injury",
    ],
    signsOfFailure: [
      "Cracks, holes, or splits in the outer shell",
      "Harness assembly frayed, broken straps, missing rivets, or non-adjustable",
      "Manufacture date more than 3 years ago (stamp inside crown)",
      "Shell painted over (paint can mask damage and degrade the shell material)",
      "Shell chalky, brittle, or faded significantly (UV degradation)",
      "Dents or deformation from an impact",
      "Inside of shell shows any cracking or white stress marks",
    ],
    immediateActions: [
      "Take the hard hat out of service immediately",
      "Do not allow the worker to continue without a serviceable replacement",
      "Issue a replacement from the site PPE store",
      "Record the defective unit as damaged/disposed",
    ],
    reinstatementRequired: [
      "Replacement hard hat meets AS/NZS 1801",
      "Manufacture date confirmed — not older than 3 years",
      "Harness assembly fits correctly and is adjusted to the worker's head size",
    ],
    stopWorkTrigger:
      "Worker in an area where head injury risk exists without a serviceable, compliant hard hat. Worker must leave the risk area immediately.",
    referenceSection: "Section 3.4 — Personal Protective Equipment",
    referenceDoc: "SafeWork Australia: Construction Work Code of Practice (2018) / AS/NZS 1801",
  },
  {
    id: "hi-vis",
    name: "Hi-Visibility Clothing",
    category: "PPE",
    description: "High-visibility vests, shirts, or jackets that ensure workers are visible to plant operators and vehicle drivers.",
    mustDo: [
      "Class 1 minimum for low-risk areas; Class 2 (day) or Class D/N (night/dusk) for traffic-exposed work",
      "Must comply with AS/NZS 4602",
      "Clean and in good condition — dirty or faded hi-vis loses effectiveness",
      "Must be visible — not covered by other clothing or harnesses in a way that defeats its purpose",
      "Worn whenever within the site boundary (most sites require this at all times)",
    ],
    signsOfFailure: [
      "Heavily soiled — fluorescent colour obscured by dirt or grime",
      "Retroreflective tape damaged, peeling, or missing in significant sections",
      "Garment torn such that fluorescent area is significantly reduced",
      "Garment so faded it no longer meets the brightness standard",
    ],
    immediateActions: [
      "Issue a replacement garment from the PPE store",
      "If in a traffic-exposed area, move the worker away from traffic until replacement issued",
      "Dispose of the defective garment so it cannot be re-issued",
    ],
    reinstatementRequired: [
      "Replacement garment meets AS/NZS 4602 Class appropriate for the work area",
    ],
    stopWorkTrigger:
      "Worker in a traffic-exposed area without serviceable hi-vis. Worker must move clear of traffic immediately.",
    referenceSection: "Section 3.4 — Personal Protective Equipment",
    referenceDoc: "SafeWork Australia: Construction Work Code of Practice (2018) / AS/NZS 4602",
  },

  // ─── HAZARDOUS MATERIALS ────────────────────────────────────────────────
  {
    id: "silica-dust-controls",
    name: "Silica Dust Controls (Cutting / Grinding)",
    category: "Hazardous Materials",
    description: "Engineering controls to suppress or capture crystalline silica dust when cutting, grinding, drilling, or demolishing concrete, stone, or masonry.",
    mustDo: [
      "Wet cutting (water suppression) as the primary control for all concrete/masonry cutting",
      "Local exhaust ventilation (on-tool extraction) used on angle grinders and core drills where wet cutting is not practicable",
      "Half-face respirator with P2 filter minimum when engineering controls are in use; P3 or full-face for uncontrolled silica-generating tasks",
      "Respiratory equipment fitted and fit-tested for the individual worker",
      "Exposure monitoring where tasks are repeated and controls cannot be confirmed as adequate",
    ],
    signsOfFailure: [
      "Dry cutting of concrete or masonry — no water suppression and no on-tool extraction",
      "Water supply blocked, hose disconnected, or water not flowing during cutting",
      "Vacuum extractor hose disconnected from tool or filter full/blocked",
      "Worker not wearing respiratory protection during cutting",
      "Disposable dust masks (P1 or surgical masks) used instead of P2 respirator",
    ],
    immediateActions: [
      "Stop the dry cutting task immediately",
      "Move all workers downwind away from the dust cloud",
      "Re-establish wet cutting or on-tool extraction before resuming",
      "Issue correct P2 respirator to worker if not worn",
      "Notify supervisor and record the exposure event",
    ],
    reinstatementRequired: [
      "Water supply confirmed flowing and providing adequate suppression",
      "Vacuum extractor filter checked and cleared",
      "Correct respiratory protection confirmed worn and properly fitted",
      "Competent person checks controls are working before task resumes",
    ],
    stopWorkTrigger:
      "Any dry cutting of concrete, masonry, or stone without engineering controls (wet cutting or on-tool extraction). Stop immediately — silicosis risk is irreversible.",
    referenceSection: "Section 13 — Hazardous Substances",
    referenceDoc: "SafeWork Australia: Construction Work Code of Practice / Crystalline Silica Exposure in Construction CoP",
  },

  // ─── CONFINED SPACES ─────────────────────────────────────────────────────
  {
    id: "confined-space-entry",
    name: "Confined Space Entry Controls",
    category: "Confined Spaces",
    description: "Procedures, permits, and physical controls required before any worker enters a confined space (pits, tanks, tunnels, vaults, sewers).",
    mustDo: [
      "Confined Space Entry Permit completed and signed before entry",
      "Atmospheric testing for oxygen (19.5–23.5% acceptable), flammable gas (< 5% LEL), and toxic gases (CO < 25ppm, H₂S < 1ppm) before and during entry",
      "Trained standby person stationed at the entry point at all times during the entry",
      "Rescue plan documented and rescue equipment (harness, tripod, winch or equivalent) at the entry point",
      "Forced ventilation provided for all engulfment or oxygen-deficient spaces",
      "All workers entering completed confined space training (current certificate)",
    ],
    signsOfFailure: [
      "No permit displayed at the entry point",
      "Standby person has left the entry point",
      "Gas detector not operating, not calibrated, or alarm sounding",
      "Ventilation fan off, duct disconnected, or fan not reaching the work area",
      "Rescue equipment not at the entry point",
      "More workers in the space than the permit authorises",
    ],
    immediateActions: [
      "Standby person to call all workers out of the space immediately",
      "Do not enter the space to rescue — call emergency services (000) if worker is unconscious or unresponsive inside",
      "Establish a 5m exclusion zone around the entry point",
      "Notify the supervisor immediately",
      "Do not re-enter until all permit conditions are confirmed re-established",
    ],
    reinstatementRequired: [
      "New atmospheric test results confirmed acceptable",
      "Ventilation restored and confirmed reaching the work area",
      "Permit re-issued or re-confirmed for re-entry",
      "Rescue equipment confirmed at entry point",
      "Standby person in position before any worker re-enters",
    ],
    stopWorkTrigger:
      "Any entry or continued presence in a confined space without a current permit, standby person, working gas monitor, or adequate ventilation. All workers exit immediately.",
    referenceSection: "Section 6 — Confined Spaces",
    referenceDoc: "SafeWork Australia: Confined Spaces Code of Practice (2017) / AS 2865",
  },
];

export const CATEGORIES: ControlCategory[] = [
  "Working at Heights",
  "Excavation",
  "Electrical",
  "Plant & Equipment",
  "Traffic & Access",
  "Fire & Emergency",
  "PPE",
  "Hazardous Materials",
  "Confined Spaces",
  "General",
];

export const CATEGORY_COLOURS: Record<ControlCategory, string> = {
  "Working at Heights": "bg-orange-500",
  "Excavation": "bg-amber-600",
  "Electrical": "bg-yellow-400 text-black",
  "Plant & Equipment": "bg-blue-600",
  "Traffic & Access": "bg-lime-500 text-black",
  "Fire & Emergency": "bg-red-600",
  "PPE": "bg-teal-600",
  "Hazardous Materials": "bg-purple-600",
  "Confined Spaces": "bg-indigo-600",
  "General": "bg-gray-600",
};
