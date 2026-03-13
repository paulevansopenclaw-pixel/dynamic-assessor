# Technical Diagrams - Dynamic Assessor

## 1. Check Dams (Rock/Sandbag)
Used in channels to reduce velocity and prevent erosion.

```mermaid
graph TD
    A[Start: Water Flowing in Channel] --> B{Is the channel grade > 2%?}
    B -- Yes --> C[Install Check Dams]
    B -- No --> D[Vegetation/Linings sufficient]
    
    C --> E[Technical Specs]
    E --> E1[Height: Max 500mm at center]
    E --> E2[Materials: 40-75mm clean rock or sandbags]
    E --> E3[Spacing: L = H / S <br/>where L=spacing, H=height, S=slope]
    
    subgraph Construction Detail
        E1
        E2
    end
```

### Critical Maintenance:
- Remove sediment when it reaches 1/2 the height of the dam.
- Inspect for undercutting at the edges.

---

## 2. Stormwater Inlet Protection (Gully Pit)
Preventing sediment from entering the pipe network.

```mermaid
graph TD
    A[Start: Surface Runoff heading to Pit] --> B{Is the pit on a 'Sag' or 'On Grade'?}
    B -- Sag (Low point) --> C[Block and Gravel / Mesh & Gravel]
    B -- On Grade --> D[Sandbag barrier with overflow]
    
    C --> E[Technical Specs]
    E --> E1[Gravel: 20mm aggregate]
    E --> E2[Internal Sump: 300-600mm depth if possible]
    E --> E3[Overflow: Must have a clear path to prevent flooding]
    
    subgraph Installation Warning
        W[NEVER lay geofabric flat over the grate]
    end
```

### Critical Maintenance:
- Replace aggregate if blinded with fine silt.
- Clear debris after every 10mm+ rain event.
