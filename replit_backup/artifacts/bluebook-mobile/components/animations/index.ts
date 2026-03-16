import { AnimationMap } from "./types";

import {
  SiltFenceContourAnimation,
  SiltFencePostSpacingAnimation,
  SiltFenceAnchorTrenchAnimation,
  SiltFenceSedimentLevelAnimation,
} from "./SiltFenceAnimations";

import {
  BasinOutletLevelAnimation,
  BasinFillGaugeAnimation,
  BasinOutletRipRapAnimation,
} from "./SedimentBasinAnimations";

import {
  BlanketAnchorTrenchAnimation,
  BlanketPegGridAnimation,
  BlanketJointOverlapAnimation,
} from "./ErosionBlanketAnimations";

import {
  MulchThicknessAnimation,
  MulchTackCrimpAnimation,
  HydromulchLayersAnimation,
  MulchTimingAnimation,
} from "./MulchingAnimations";

import {
  ConcreteWashoutLinerAnimation,
  WashoutDistanceAnimation,
  FuelBund110Animation,
  DustWaterCartAnimation,
  DrainFilterBagAnimation,
  DiversionDrainAnimation,
} from "./WaterChemicalAnimations";

import {
  StabilisedEntryRockDepthAnimation,
  StabilisedEntryLengthAnimation,
  VegetationTPZFencingAnimation,
  TopsoilStockpileProfileAnimation,
  SedimentTrapFreeboardAnimation,
} from "./OtherControlAnimations";

export const ANIMATION_MAP: AnimationMap = {
  "silt-fence": [
    {
      title: "Installed Across the Slope Contour",
      spec: "Installed across the slope contour — not parallel to flow direction. Flow must hit the fence perpendicularly to allow sediment to settle.",
      AnimationComponent: SiltFenceContourAnimation,
    },
    {
      title: "Post Spacing — Maximum 1.8 m",
      spec: "Posts driven at maximum 1.8 m spacing, minimum 450 mm into the ground. Closer spacing required in high-flow areas.",
      AnimationComponent: SiltFencePostSpacingAnimation,
    },
    {
      title: "Anchor Trench — 150 to 200 mm Burial",
      spec: "Geotextile fabric buried minimum 150–200 mm in an anchor trench at the base. The trench is backfilled to prevent piping beneath the fence.",
      AnimationComponent: SiltFenceAnchorTrenchAnimation,
    },
    null, // req 3: fabric height 600mm - covered by anchor trench anim
    null, // req 4: joints - no anim
    null, // req 5: not in concentrated flow
    null, // req 6: inspect after 10mm
    {
      title: "Sediment Removal — Clean at 1/3 Height",
      spec: "Sediment must be removed when accumulation reaches 1/3 of the fabric height above ground. Allowing sediment to build higher reduces effectiveness and risks overtopping.",
      AnimationComponent: SiltFenceSedimentLevelAnimation,
    },
  ],

  "sediment-basin": [
    null, // sizing — complex engineering
    null, // 250m³/ha
    {
      title: "Outlet Structure — 300 mm Above Sediment Zone",
      spec: "The outlet structure must be at least 300 mm above the sediment storage zone. This ensures sediment-laden water near the bottom is never directly discharged.",
      AnimationComponent: BasinOutletLevelAnimation,
    },
    null, // sediment storage zone marking
    null, // bund compacted
    null, // inspect
    {
      title: "Sediment Removal — Clean at 50% Capacity",
      spec: "Sediment must be removed when the storage zone is 50% full. A depth gauge must be installed so workers can check the fill level without entering the basin.",
      AnimationComponent: BasinFillGaugeAnimation,
    },
    {
      title: "Outlet Energy Dissipation — Rock Rip-Rap",
      spec: "The outlet must be protected with rock rip-rap or equivalent energy dissipation to prevent scour at the discharge point.",
      AnimationComponent: BasinOutletRipRapAnimation,
    },
  ],

  "sediment-trap": [
    null, // sizing
    null, // inlet/outlet protection
    {
      title: "Freeboard — Minimum 600 mm",
      spec: "The trap must maintain minimum 600 mm freeboard above the design water level at all times. If water is close to the top, the trap must be cleaned out immediately.",
      AnimationComponent: SedimentTrapFreeboardAnimation,
    },
    null, // inspect
    null, // clean at 50%
  ],

  "stabilised-entry": [
    {
      title: "Minimum Length — 15 m from Boundary",
      spec: "The stabilised pad must be at least 15 m long from the property boundary (30 m preferred for heavy plant). This length is needed to dislodge mud from tyres before reaching the road.",
      AnimationComponent: StabilisedEntryLengthAnimation,
    },
    null, // width
    {
      title: "Crushed Rock Depth — Minimum 150 mm",
      spec: "40–50 mm crushed rock placed at minimum 150 mm depth over a geotextile fabric layer. The geotextile prevents rock from mixing with subgrade soil.",
      AnimationComponent: StabilisedEntryRockDepthAnimation,
    },
    null, // wheel wash
    null, // inspect weekly
    null, // replenish at 100mm
    null, // sweep up
  ],

  "erosion-blanket": [
    null, // slope gradient — when to use
    {
      title: "Overlaps — Horizontal 150 mm, Vertical 300 mm",
      spec: "Horizontal joints must overlap minimum 150 mm. Vertical joints (down-slope) must overlap minimum 300 mm and be post-supported to prevent water from getting under the blanket.",
      AnimationComponent: BlanketJointOverlapAnimation,
    },
    {
      title: "Anchor Trench at Slope Crest — 300 mm Deep",
      spec: "At the top of every slope, the blanket must be buried 300 mm deep in an anchor trench that is then backfilled. This prevents the blanket from peeling back at the crest under water flow.",
      AnimationComponent: BlanketAnchorTrenchAnimation,
    },
    {
      title: "Peg Grid — 1 m Spacing Across the Blanket",
      spec: "U-shaped pegs must be placed at a minimum 1 m grid pattern across the entire blanket surface. This keeps the blanket in contact with the soil and prevents it lifting in wind or flow.",
      AnimationComponent: BlanketPegGridAnimation,
    },
    null, // seed beneath
    null, // inspect
  ],

  "mulching": [
    {
      title: "Straw Mulch Thickness — Minimum 50 mm",
      spec: "Straw mulch must be applied to a minimum thickness of 50 mm at approximately 2.5 t/ha. This depth is needed to effectively protect the soil surface from raindrop impact.",
      AnimationComponent: MulchThicknessAnimation,
    },
    {
      title: "Tack or Crimp on Slopes",
      spec: "On slopes, mulch must be tacked (spray adhesive) or crimped (mechanically pressed) into the soil surface to prevent it being blown or washed off before vegetation establishes.",
      AnimationComponent: MulchTackCrimpAnimation,
    },
    {
      title: "Hydromulch — 2 to 3 Layers",
      spec: "Hydromulch must be applied according to the manufacturer's specifications, typically in 2–3 layers. Each layer builds coverage and improves soil adhesion and seed contact.",
      AnimationComponent: HydromulchLayersAnimation,
    },
    {
      title: "Apply Within 24–48 Hours of Final Grading",
      spec: "Mulch must be applied within 24–48 hours after final grading if revegetation is not occurring immediately. After 48 hours, the exposed soil becomes significantly more vulnerable to erosion.",
      AnimationComponent: MulchTimingAnimation,
    },
    null, // maintained in place
  ],

  "concrete-washout": [
    {
      title: "Minimum 50 m from Waterway",
      spec: "The washout area must be located at least 50 m from any waterway, drain, or stormwater inlet. This buffer protects against accidental spills reaching the drainage network.",
      AnimationComponent: WashoutDistanceAnimation,
    },
    {
      title: "200µm Impermeable Liner with Bunded Walls",
      spec: "The washout area must be lined with 200µm (0.2mm) polyethylene sheeting or equivalent and bunded on all sides. No stormwater drain connection is permitted inside the washout area.",
      AnimationComponent: ConcreteWashoutLinerAnimation,
    },
    null, // bunded 300mm high
    null, // signposted
    null, // capacity
    null, // inspect daily
    null, // clean at 75%
    null, // washwater testing
  ],

  "fuel-bunding": [
    {
      title: "Bund Capacity — 110% of Largest Container",
      spec: "The bund must hold at least 110% of the volume of the largest single container stored within. This ensures that a complete failure of that container can be fully contained.",
      AnimationComponent: FuelBund110Animation,
    },
    null, // impermeable construction
    null, // no stormwater drain
    null, // spill kit adjacent
    null, // containers labelled
    null, // 50m from waterways
    null, // inspect weekly
    null, // refuelling in bund
  ],

  "dust-suppression": [
    {
      title: "Water Cart — Active During All Earthworks",
      spec: "A water cart must be operational and on-site whenever earthworks are occurring. If the water cart breaks down, earthworks must stop until it is repaired or replaced.",
      AnimationComponent: DustWaterCartAnimation,
    },
    null, // all exposed areas
    null, // haul roads every 2 hours
    null, // wind speed monitoring
    null, // dust suppressants
    null, // stockpiles covered
  ],

  "drain-protection": [
    {
      title: "Filter Bag Installed Over Stormwater Pit",
      spec: "A filter bag or geotextile sock must be installed over or inside every stormwater inlet pit within and adjacent to the site. The filter is secured so it cannot be dislodged by normal flows.",
      AnimationComponent: DrainFilterBagAnimation,
    },
    null, // geotextile rating
    null, // secured in place
    null, // inspect after 10mm
    null, // clean at 50%
    null, // not causing flooding
  ],

  "diversion-drain": [
    {
      title: "Installed Upslope — Diverts Clean Run-On",
      spec: "The diversion drain is installed upslope of all disturbed areas before earthworks begin. Its purpose is to intercept clean runoff from higher ground and direct it around the site, reducing the volume of water that passes over exposed soil.",
      AnimationComponent: DiversionDrainAnimation,
    },
    null, // sizing
    null, // outlet
    null, // batter slopes
    null, // inspect
    null, // no ponding
  ],

  "vegetation-buffer": [
    null, // buffer width as per CEMP
    {
      title: "Orange Exclusion Fencing at TPZ Boundary",
      spec: "The Tree Protection Zone must be clearly demarcated with orange exclusion fencing. No plant, machinery, or stockpiles may access inside the zone. Fencing is inspected weekly.",
      AnimationComponent: VegetationTPZFencingAnimation,
    },
    null, // no access
    null, // no stripping
    null, // inspect weekly
  ],

  "topsoil-stockpile": [
    {
      title: "Maximum 2 m Height — Batter Slopes 2H:1V",
      spec: "Topsoil stockpiles must not exceed 2 m in height. Batter slopes must be no steeper than 2H:1V (horizontal to vertical). A silt fence must be placed around the full perimeter.",
      AnimationComponent: TopsoilStockpileProfileAnimation,
    },
    null, // silt fence perimeter
    null, // covered if > 2 weeks
    null, // no compaction
    null, // no access
    null, // signage
  ],
};

export { RequirementAnimation } from "./types";
