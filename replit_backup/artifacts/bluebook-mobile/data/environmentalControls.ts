export type ControlCategory =
  | "Sediment Control"
  | "Erosion Control"
  | "Water Management"
  | "Chemical Management"
  | "Vegetation Protection"
  | "Dust Management";

export interface EnvironmentalControl {
  id: string;
  name: string;
  category: ControlCategory;
  shortDescription: string;
  purpose: string[];
  requirements: string[];
  signsOfFailure: string[];
  immediateActions: string[];
  reinstatement: string[];
  stopWorkTrigger: string;
  referenceSection: string;
}

export const CONTROLS: EnvironmentalControl[] = [
  {
    id: "silt-fence",
    name: "Silt Fence",
    category: "Sediment Control",
    shortDescription: "Geotextile barrier installed across slope to intercept and retain sediment-laden runoff.",
    purpose: [
      "Intercept sheet flow runoff carrying fine sediment particles",
      "Allow water to pass through while retaining sediment behind the fence",
      "Protect waterways, drains, and neighbouring properties from site sediment",
    ],
    requirements: [
      "Installed across the slope contour (not parallel to flow direction)",
      "Posts maximum 1.8m spacing, driven minimum 450mm into ground",
      "Geotextile fabric buried minimum 150–200mm in an anchor trench at the base",
      "Fabric height minimum 600mm above ground level",
      "Joints overlapped minimum 300mm and post-supported at the overlap",
      "Not used in concentrated flow areas — sediment basin required instead",
      "Inspected after every 10mm rainfall event and repaired within 24 hours",
      "Sediment removed when accumulation reaches 1/3 of fabric height above ground",
    ],
    signsOfFailure: [
      "Fabric torn, holed, or pulled away from posts",
      "Posts leaning significantly or fallen over",
      "Anchor trench not dug — fabric only surface-pinned",
      "Sediment accumulated to > 1/3 fabric height and not removed",
      "Runoff bypassing ends of fence (fence not long enough across slope)",
      "Pooling water undermining the base — piping under the fence",
      "Used in a concentrated flow channel (incorrect application)",
    ],
    immediateActions: [
      "Halt earthworks in the upslope catchment contributing to the failed fence",
      "Repair or replace the failed fence section before rainfall is forecast",
      "If sediment has left the site, notify supervisor and document the escape",
      "Install secondary barrier downslope of the failure as temporary measure",
      "Check downstream drains and remove any deposited sediment immediately",
    ],
    reinstatement: [
      "Anchor trench re-dug and fabric properly embedded",
      "Posts driven to full depth with correct spacing",
      "Fabric height 600mm above ground, no tears or gaps",
      "Fence run extends beyond the full width of the contributing flow area",
      "Supervisor inspection and sign-off before earthworks resume",
    ],
    stopWorkTrigger:
      "Rain is forecast and silt fences protecting drainage lines or site boundaries are failed/missing. Earthworks within the contributing catchment must stop.",
    referenceSection: "Blue Book Section B1 — Silt Fence",
  },
  {
    id: "sediment-basin",
    name: "Sediment Basin",
    category: "Sediment Control",
    shortDescription: "Engineered detention pond that captures concentrated runoff and allows sediment to settle before water is released.",
    purpose: [
      "Capture sediment-laden runoff from large disturbed catchments",
      "Allow sufficient detention time for sediment particles to settle",
      "Provide first line of defence before runoff leaves the site",
    ],
    requirements: [
      "Sized to capture the first flush of a 1-in-5 year, 24-hour storm event for the contributing catchment",
      "Designed minimum 250m³ per hectare of disturbed catchment (or engineered sizing)",
      "Outlet structure at least 300mm above the sediment storage zone",
      "Sediment storage zone depth minimum 0.5m, clearly marked with a depth gauge",
      "Earth bund compacted and vegetated or armoured on the downstream face",
      "Inspected after every rainfall event ≥ 10mm",
      "Sediment removed when storage zone is 50% full",
      "Outlet protected with rock rip-rap or equivalent energy dissipation",
    ],
    signsOfFailure: [
      "Sediment storage zone more than 50% full — outlet is at risk",
      "Bund wall showing erosion, piping, seepage, or cracking",
      "Outlet pipe blocked, dislodged, or bypassed",
      "Turbid water discharging at the outlet without adequate detention",
      "Basin bypassed by channelled flow going around the bund",
      "No depth gauge present or gauge unreadable",
    ],
    immediateActions: [
      "Stop all earthworks in the contributing catchment immediately",
      "Notify supervisor and the environmental manager/rep",
      "If bund is breached or threatening to fail — evacuate the area and call the site manager",
      "Install secondary sediment controls (hay bales, silt socks) at site boundary while repairs are made",
      "If turbid discharge has reached a waterway — notify the EPA and supervisor immediately",
    ],
    reinstatement: [
      "Sediment excavated from storage zone, volume and disposal location recorded",
      "Bund repaired and re-compacted where eroded",
      "Outlet structure inspected and confirmed operational",
      "Depth gauge reinstated and calibrated",
      "Engineer sign-off required if structural work was done on the bund",
      "Supervisor inspection before earthworks resume in the catchment",
    ],
    stopWorkTrigger:
      "Sediment basin is at 50%+ capacity, bund is showing structural failure signs, or outlet is blocked. All earthworks in the contributing catchment must stop until repaired.",
    referenceSection: "Blue Book Section B2 — Sediment Basin",
  },
  {
    id: "sediment-trap",
    name: "Sediment Trap / Catch Drain",
    category: "Sediment Control",
    shortDescription: "Small, temporary detention area installed at the base of a slope or at drainage outlets to capture sediment.",
    purpose: [
      "Capture fine sediment from small disturbed areas before it reaches drains",
      "Provide a low-cost sediment control for small catchments (< 0.5 ha)",
    ],
    requirements: [
      "Sized for contributing catchment — minimum 250m³/ha",
      "Inlet and outlet protected with rock rip-rap or geotextile",
      "Minimum 600mm freeboard above the design water level",
      "Inspected after each rainfall event ≥ 10mm",
      "Cleaned out when sediment volume reaches 50% of the trap capacity",
    ],
    signsOfFailure: [
      "Trap full of sediment with no freeboard remaining",
      "Inlet or outlet eroded, allowing bypass",
      "Accumulated sediment has not been removed",
      "Trap undersized for the contributing catchment",
    ],
    immediateActions: [
      "Stop earthworks contributing runoff to the trap",
      "Remove accumulated sediment before the next forecast rain",
      "Check that downstream drains are clear of deposited sediment",
    ],
    reinstatement: [
      "Sediment removed and disposed of appropriately (not into stormwater)",
      "Rock protection at inlet/outlet reinstated",
      "Trap re-inspected and confirmed serviceable before earthworks resume",
    ],
    stopWorkTrigger:
      "Trap is full with no freeboard. Earthworks must stop until it is cleaned out.",
    referenceSection: "Blue Book Section B3 — Sediment Trap",
  },
  {
    id: "stabilised-entry",
    name: "Stabilised Construction Entry/Exit",
    category: "Sediment Control",
    shortDescription: "Rock-covered pad at all vehicle entry/exit points to dislodge mud from tyres before vehicles enter public roads.",
    purpose: [
      "Remove mud and sediment from vehicle tyres before they reach public roads",
      "Prevent tracking of soil from the site onto sealed road surfaces",
      "Reduce offsite sediment export from vehicle movements",
    ],
    requirements: [
      "Minimum length 15m from the property boundary (30m preferred for heavy plant)",
      "Minimum width equal to full width of the entry, minimum 3.5m per lane",
      "Crushed rock (40–50mm aggregate) minimum 150mm depth",
      "Geotextile fabric beneath rock layer to prevent mixing with subgrade",
      "Wheel wash or rumble bars if 15m pad is insufficient to remove mud",
      "Inspected weekly and after heavy vehicle movements",
      "Rock replenished when less than 100mm depth remains",
      "Sediment accumulated at edges swept up and returned to site",
    ],
    signsOfFailure: [
      "Sediment or mud visible on the road surface outside the entry",
      "Rock pad worn down to less than 100mm depth",
      "Gaps in rock pad allowing direct access to bare soil",
      "Vehicle tyres visibly carrying mud off-site",
      "Width of pad narrower than vehicle track — vehicles bypassing the pad",
    ],
    immediateActions: [
      "Clean mud off the road surface immediately — it is an environmental and safety offence",
      "Stop vehicle movements until the pad is reinstated to required depth",
      "Sweep up all sediment from road and return it to site",
      "Notify supervisor of the offsite sediment escape",
      "If mud has entered a stormwater drain — advise council and supervisor",
    ],
    reinstatement: [
      "Rock pad replenished to minimum 150mm depth across full width",
      "Geotextile layer intact (replace if mixed with subgrade)",
      "Road clean and no visible sediment before vehicle movements resume",
      "Supervisor inspection and sign-off",
    ],
    stopWorkTrigger:
      "Mud is being tracked onto a public road. Vehicle movements must cease until the pad is reinstated and the road is clean.",
    referenceSection: "Blue Book Section B5 — Stabilised Construction Entry",
  },
  {
    id: "erosion-blanket",
    name: "Erosion Blanket / Jute Mesh",
    category: "Erosion Control",
    shortDescription: "Biodegradable geotextile mat pinned to exposed slopes to protect soil surface from raindrop impact and runoff erosion.",
    purpose: [
      "Protect exposed soil on embankments and cut slopes from rain splash erosion",
      "Hold seed or mulch in contact with the soil surface during establishment",
      "Provide immediate erosion protection while vegetation establishes",
    ],
    requirements: [
      "Installed on slopes ≥ 2H:1V (horizontal to vertical) where erosion risk is high",
      "Overlaps minimum 150mm on horizontal joints, 300mm on vertical joints",
      "Anchor trench at the crest of the slope: 300mm deep, fabric buried and backfilled",
      "Pegged at minimum 1m grid with U-shaped metal or timber pegs",
      "Seed and fertiliser applied beneath the mat before installation",
      "Inspected after each rainfall event ≥ 10mm",
    ],
    signsOfFailure: [
      "Blanket lifted, rolled back, or dislodged by wind or water",
      "Pegs pulled out — blanket no longer in contact with soil surface",
      "Tears or holes in the mat exposing bare soil to direct rainfall",
      "No anchor trench at the top — mat peeling back at the crest",
      "Blanket end floating in stormwater flow, lifting off the slope",
    ],
    immediateActions: [
      "Re-pin dislodged sections and re-dig anchor trench if required",
      "Cover any exposed bare soil with temporary mulch until mat is repaired",
      "Inspect downslope drains for sediment deposited from exposed areas",
      "Repair before next forecast rainfall event",
    ],
    reinstatement: [
      "All sections firmly pegged at 1m grid",
      "Anchor trench at crest properly backfilled",
      "All joints overlapped to specification",
      "No bare soil visible between mat and the slope surface",
    ],
    stopWorkTrigger:
      "Large areas of exposed slope are unprotected with rain forecast. Grading/earthworks on that slope must pause until adequate erosion protection is in place.",
    referenceSection: "Blue Book Section B6 — Erosion Blankets",
  },
  {
    id: "mulching",
    name: "Mulching of Disturbed Areas",
    category: "Erosion Control",
    shortDescription: "Application of straw, wood chip, or hydromulch over disturbed soil to reduce erosion and support revegetation.",
    purpose: [
      "Reduce raindrop impact energy on exposed soil",
      "Decrease surface runoff velocity and soil detachment",
      "Retain soil moisture and promote seed germination",
    ],
    requirements: [
      "Straw mulch minimum 50mm thickness, applied at approximately 2.5 t/ha",
      "Tacked or crimped into the soil surface on slopes (to prevent wind blow-off)",
      "Hydromulch applied to coverage specified by manufacturer (typically 2–3 layers)",
      "Applied within 24–48 hours of final grading if revegetation not following immediately",
      "Maintained in place — replenish if wind or rain disturbs the coverage",
    ],
    signsOfFailure: [
      "Mulch blown or washed away exposing bare soil",
      "Coverage thin (< 50% coverage visible on the surface)",
      "No tacking — loose straw in a wind-prone area",
      "Hydromulch crust cracked or peeled off exposing bare soil",
    ],
    immediateActions: [
      "Re-apply mulch to exposed areas within 24 hours (particularly if rain is forecast)",
      "Use tack or crimp straw in wind-exposed areas",
      "Document coverage loss and advise supervisor",
    ],
    reinstatement: [
      "Full coverage re-established across all disturbed areas",
      "Straw tacked on slopes and in wind-exposed locations",
      "Application rate confirmed as specified",
    ],
    stopWorkTrigger:
      "Large areas of disturbed, unprotected soil with rain or wind forecast. Further disturbance must not occur until protection is applied.",
    referenceSection: "Blue Book Section B7 — Mulching",
  },
  {
    id: "concrete-washout",
    name: "Concrete Washout Area",
    category: "Chemical Management",
    shortDescription: "Designated lined area where concrete trucks and equipment are washed out to prevent alkaline washwater entering stormwater.",
    purpose: [
      "Capture concrete washwater (highly alkaline pH 11–13) before it reaches drains",
      "Prevent concrete slurry from entering stormwater, waterways, or drains",
      "Provide a controlled location for all concrete and mortar waste disposal",
    ],
    requirements: [
      "Located minimum 50m from any waterway, drain, or stormwater inlet",
      "Lined with 200µm (0.2mm) polyethylene sheeting or equivalent impermeable material",
      "Bunded on all sides (minimum 300mm high earthen or sandbag bund)",
      "Clearly signposted: CONCRETE WASHOUT AREA — NO OTHER WASTE",
      "Capacity sufficient for the volume of pours being undertaken",
      "Inspected daily during active concrete works",
      "Cleaned out when concrete waste reaches 75% of capacity — hardened concrete crushed and disposed to landfill",
      "Washwater tested before disposal — must not be discharged to sewer or stormwater without approval",
    ],
    signsOfFailure: [
      "Liner torn or punctured — concrete slurry seeping into ground",
      "Bund overtopped — washwater running across site toward drains",
      "Washout area not being used — trucks washing out in uncontrolled locations",
      "Area 75%+ full with no cleanout scheduled",
      "Concrete washwater seeping toward or entering a stormwater drain or waterway",
    ],
    immediateActions: [
      "Stop all concrete washout operations in the affected area immediately",
      "If washwater has entered a drain or waterway — notify supervisor and EPA immediately",
      "Block the drain entry point if possible (sand bags, drain plug)",
      "Contain any washwater escape with earthen bunds or sand bags",
      "Document the incident with photos and time",
    ],
    reinstatement: [
      "Liner repaired or replaced",
      "Bunds rebuilt and confirmed to contain the design volume",
      "Area cleaned out to below 50% capacity before works resume",
      "Trucks briefed on washout area location before concrete pours resume",
    ],
    stopWorkTrigger:
      "No functional concrete washout area during active pours, or liner failure with slurry escaping. Concrete works must stop until reinstated.",
    referenceSection: "Blue Book Section B8 — Concrete Washout",
  },
  {
    id: "fuel-bunding",
    name: "Chemical & Fuel Storage Bunding",
    category: "Chemical Management",
    shortDescription: "Impermeable bund wall around chemical and fuel storage areas to contain spills and prevent ground and water contamination.",
    purpose: [
      "Contain spills and leaks from fuel, oil, and chemical containers",
      "Prevent hydrocarbons and chemicals from reaching soil, groundwater, or stormwater",
      "Comply with AS 1940 and EPA requirements for on-site chemical storage",
    ],
    requirements: [
      "Bund capacity minimum 110% of the largest single container volume stored within",
      "Bund constructed of concrete, compacted clay, or impermeable liner — no gaps",
      "No stormwater drainage connection inside the bunded area",
      "Spill kits located adjacent to the storage area and fully stocked",
      "Containers labelled, stored upright with lids/caps secured",
      "Minimum 50m from waterways, drainage lines, and stormwater inlets",
      "Inspected weekly — any accumulated rainfall inside bund to be tested before release",
      "Refuelling only within or adjacent to the bunded area",
    ],
    signsOfFailure: [
      "Bund wall cracked, holed, or with an open stormwater drain outlet",
      "Accumulated hydrocarbon-contaminated water inside bund overflowing",
      "Fuel or chemical spill visible outside the bund area",
      "Containers stored outside the bund",
      "Spill kit absent, empty, or used up without being restocked",
      "Refuelling occurring away from the bunded area on bare ground",
    ],
    immediateActions: [
      "Stop all fuelling and chemical handling operations immediately",
      "Contain any visible spill with absorbent pads from the spill kit",
      "If fuel or chemical has reached soil or a drain — notify supervisor and EPA immediately",
      "Prevent ignition sources near any fuel spill",
      "Record volume and type of spill, time, and area affected",
    ],
    reinstatement: [
      "Bund wall repaired — no visible cracks or gaps",
      "Contaminated soil removed and disposed of at approved facility",
      "Spill kit restocked to full specification",
      "All containers returned inside the bund and properly labelled",
      "Supervisor sign-off before fuelling operations resume",
    ],
    stopWorkTrigger:
      "Active fuel or chemical spill reaching soil, stormwater, or a waterway. All fuelling/chemical handling stops. Notify EPA if spill leaves the site.",
    referenceSection: "Blue Book Section B9 — Chemical Storage",
  },
  {
    id: "dust-suppression",
    name: "Dust Suppression",
    category: "Dust Management",
    shortDescription: "Water cart, spray systems, or dust suppressants applied to control dust generation from earthworks and vehicle movements.",
    purpose: [
      "Prevent offsite dust nuisance to neighbouring residents and businesses",
      "Reduce particulate matter from entering waterways via aerial deposition",
      "Comply with Protection of the Environment Operations (Air Quality) requirements",
    ],
    requirements: [
      "Water cart operational and on-site whenever earthworks are occurring",
      "All exposed areas watered if visible dust is being generated",
      "Haul roads watered at minimum every 2 hours during dry, windy conditions",
      "Wind speed monitoring — earthworks to be suspended if wind > 15m/s with visible dust",
      "Chemical dust suppressants applied on haul roads if water supply is limited (as per product specs)",
      "Stockpiles covered or treated with suppressant if adjacent to sensitive receivers",
    ],
    signsOfFailure: [
      "Visible dust plume leaving the site boundary",
      "Water cart unavailable, broken down, or out of water",
      "No watering of haul roads during dry/windy conditions",
      "Dust nuisance complaints received from neighbours",
      "Dust settling on neighbouring properties (dust fallout)",
    ],
    immediateActions: [
      "Halt all earthworks and vehicle movements on the dusty area immediately",
      "Apply water (or alternative suppressant) before works resume",
      "If water cart unavailable — stop excavation and grading until equipment is repaired",
      "Document the dust escape event — time, duration, direction, affected areas",
      "Respond to any community complaints within 24 hours",
    ],
    reinstatement: [
      "Water cart operational and stocked",
      "All exposed surfaces watered before earthworks resume",
      "If wind speed remains high — wait for conditions to improve before resuming",
    ],
    stopWorkTrigger:
      "Visible dust plume crossing the site boundary with no means of suppression available. Earthworks must stop until water cart is operational.",
    referenceSection: "Blue Book Section B10 — Dust Management",
  },
  {
    id: "drain-protection",
    name: "Stormwater Inlet Protection (Drain Guard)",
    category: "Water Management",
    shortDescription: "Filter bags, sediment socks, or geotextile covers placed over stormwater inlet pits to prevent sediment from entering the drainage system.",
    purpose: [
      "Intercept sediment before it enters the underground drainage network",
      "Protect waterways and downstream receiving environments from construction sediment",
      "Provide last line of defence at the point where site runoff enters public infrastructure",
    ],
    requirements: [
      "Installed over or inside all stormwater pits within and adjacent to the site",
      "Filter geotextile rated to allow water through while retaining sediment",
      "Secured in place so it cannot be dislodged by normal flows",
      "Inspected after every rainfall event ≥ 10mm",
      "Cleaned or replaced when sediment accumulation reaches 50% of the filter/pit capacity",
      "Must not cause flooding by restricting flow beyond pit design capacity — check sizing",
    ],
    signsOfFailure: [
      "Filter bag/sock full of sediment and water ponding around the pit",
      "Filter dislodged and not covering the pit",
      "Sediment visible in the base of the pit below the filter",
      "Filter torn or holed allowing direct entry of sediment",
      "Pit lid lifted/removed and no filter in place",
    ],
    immediateActions: [
      "Remove sediment from the filter bag/pit immediately",
      "Replace or clean filter if compromised",
      "If sediment has already entered the pit — advise council (public infrastructure) or supervisor",
      "Check downstream pits for deposited sediment and flush through if required",
    ],
    reinstatement: [
      "Clean filter bag/sock installed and secured over the pit",
      "No sediment accumulation above 50% capacity",
      "Pit itself cleaned if sediment has passed through",
      "Supervisor confirmation before earthworks in the contributing area resume",
    ],
    stopWorkTrigger:
      "Active flow of sediment-laden runoff reaching a stormwater inlet with no functional filter. Immediate containment required — stop earthworks if flow cannot be redirected.",
    referenceSection: "Blue Book Section B11 — Inlet Protection",
  },
  {
    id: "diversion-drain",
    name: "Perimeter / Diversion Drain",
    category: "Water Management",
    shortDescription: "Earth or formed channel installed at the perimeter of disturbed areas to divert clean run-on water away from active works, reducing sediment load on controls.",
    purpose: [
      "Intercept clean runoff upslope of disturbance and direct it around the site",
      "Reduce the volume of water passing over disturbed areas, minimising erosion and sediment load",
      "Direct captured flows to a safe, stable outlet point",
    ],
    requirements: [
      "Installed upslope of all disturbed areas before earthworks begin",
      "Sized to pass the 1-in-10 year, 1-hour storm event for the contributing catchment",
      "Outlet energy dissipated with rock rip-rap or check dams",
      "Batter slopes and floor stabilised with compacted clay, grass, or lining if flow velocity > 0.5m/s",
      "Inspected after every rainfall event — sediment accumulation removed promptly",
      "No ponding in the drain — check for blockages at all low points",
    ],
    signsOfFailure: [
      "Drain eroded or scoured — floor and/or batter slopes cut away",
      "Outlet scoured — flow discharging onto unprotected ground",
      "Drain blocked by sediment — causing overflow onto disturbed area",
      "Drain bypassed — flow running over the bund rather than through the channel",
      "Bund/bank breached or very low in section",
    ],
    immediateActions: [
      "Repair erosion in the drain floor and banks before next rainfall",
      "Clear sediment blockage to restore design capacity",
      "Reinstate outlet energy dissipation if washed away",
      "If drain is breached — earth up the break and compact before next rain",
    ],
    reinstatement: [
      "Drain re-graded to design cross-section",
      "Banks compacted and stabilised",
      "Outlet rip-rap reinstated",
      "Drain inspected along full length before earthworks resume",
    ],
    stopWorkTrigger:
      "Diversion drain has failed and clean run-on water is now passing through disturbed areas, overwhelming downstream sediment controls.",
    referenceSection: "Blue Book Section B12 — Diversion Drains",
  },
  {
    id: "vegetation-buffer",
    name: "Vegetation Buffer / Tree Protection Zone",
    category: "Vegetation Protection",
    shortDescription: "Undisturbed vegetated strip or fenced tree protection zone retained to filter runoff and protect existing vegetation from site impacts.",
    purpose: [
      "Filter and slow runoff before it leaves the site boundary",
      "Protect ecologically significant or DA-approved retained trees from soil compaction and root damage",
      "Reduce erosion at the downslope site boundary",
    ],
    requirements: [
      "Buffer width as specified in the Construction Environmental Management Plan (CEMP) or Development Consent",
      "Clearly demarcated with orange exclusion fencing or equivalent sturdy barrier",
      "No plant, machinery, or stockpile access within the buffer/tree protection zone",
      "No topsoil stripping or grading within the designated buffer",
      "Buffer fencing inspected weekly and after any adjacent works",
    ],
    signsOfFailure: [
      "Fencing knocked down or removed — vehicles accessing the buffer zone",
      "Soil compaction visible within the tree protection zone (tyre tracks, ruts)",
      "Vegetation within the buffer cleared or damaged by equipment",
      "Stockpiles placed within or adjacent to the buffer zone",
      "Wash-out point or outlet discharging into the buffer without spreading",
    ],
    immediateActions: [
      "Immediately stop all work within the buffer/TPZ",
      "Reinstate fencing before any further works adjacent to the zone",
      "If trees have been damaged — notify supervisor, arborist, and the consent authority",
      "Photograph damage and document time, equipment, and workers involved",
    ],
    reinstatement: [
      "Buffer fencing re-erected along full length of zone",
      "Soil decompaction (ripping) and mulching in TPZ if compaction has occurred",
      "Arborist assessment if tree roots or trunk have been damaged",
      "Supervisor and environmental rep sign-off before adjacent works resume",
    ],
    stopWorkTrigger:
      "Equipment or plant has entered a Tree Protection Zone or vegetated buffer. All works in that area stop immediately pending supervisor and arborist assessment.",
    referenceSection: "Blue Book Section B13 — Vegetation Protection",
  },
  {
    id: "topsoil-stockpile",
    name: "Topsoil Stockpile Management",
    category: "Erosion Control",
    shortDescription: "Controls applied to stripped topsoil stockpiles to prevent erosion and sediment export from the stockpile during storage.",
    purpose: [
      "Retain valuable topsoil for future revegetation",
      "Prevent stockpile erosion and the associated sediment export",
      "Protect the viability of topsoil seed bank and organic matter during storage",
    ],
    requirements: [
      "Maximum stockpile height 2m, batter slopes maximum 2H:1V",
      "Silt fence installed around the perimeter of all stockpiles",
      "Stockpile surface covered with erosion blanket, mesh, or hydromulch if stored > 2 weeks",
      "Located minimum 50m from waterways and drains where possible",
      "No compaction by heavy machinery driving over stockpiles",
      "Signage: TOPSOIL — DO NOT DISTURB or USE WITHOUT AUTHORISATION",
    ],
    signsOfFailure: [
      "Bare, unvegetated stockpile with rill erosion visible on the batter face",
      "Silt fence absent, failed, or overtopped around the stockpile",
      "Stockpile batter slopes steeper than 2H:1V — unstable",
      "Tyre ruts on stockpile surface from plant driving over it",
      "Sediment trail visible downslope from the stockpile",
    ],
    immediateActions: [
      "Apply erosion blanket or hydromulch to the bare stockpile surface immediately",
      "Repair or install silt fence around the perimeter",
      "Re-grade the batter if steeper than 2H:1V and re-cover",
      "Check downstream area for deposited sediment and clean up",
    ],
    reinstatement: [
      "All batter slopes confirmed at 2H:1V or flatter",
      "Silt fence in place around full perimeter",
      "Surface covered with erosion blanket or hydromulch",
      "Supervisor inspection before stockpile is left unattended",
    ],
    stopWorkTrigger:
      "No controls in place on a topsoil stockpile with rain forecast. Topsoil stripping must not continue until existing stockpile is adequately protected.",
    referenceSection: "Blue Book Section B14 — Topsoil Stockpile",
  },
];

export const CATEGORIES: ControlCategory[] = [
  "Sediment Control",
  "Erosion Control",
  "Water Management",
  "Chemical Management",
  "Vegetation Protection",
  "Dust Management",
];

export const CATEGORY_COLOURS: Record<ControlCategory, { bg: string; text: string; border: string }> = {
  "Sediment Control": { bg: "#FFF3E4", text: "#B45309", border: "#F4A261" },
  "Erosion Control": { bg: "#D8F3DC", text: "#2D6A4F", border: "#52B788" },
  "Water Management": { bg: "#EAF2F8", text: "#1D4E6C", border: "#457B9D" },
  "Chemical Management": { bg: "#FDEAEA", text: "#991B1B", border: "#D62828" },
  "Vegetation Protection": { bg: "#F0FDF4", text: "#166534", border: "#4ADE80" },
  "Dust Management": { bg: "#FFF8E1", text: "#92400E", border: "#E9C46A" },
};
