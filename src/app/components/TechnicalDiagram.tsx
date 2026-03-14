"use client";

interface DiagramProps {
  type: 'sediment-fence' | 'check-dam' | 'inlet-protection';
}

export default function TechnicalDiagram({ type }: DiagramProps) {
  if (type === 'sediment-fence') {
    return (
      <div className="bg-white/5 p-4 rounded-2xl border border-white/10 mb-4">
        <h4 className="text-orange-400 font-bold text-xs tracking-widest uppercase mb-4">Interactive Specification</h4>
        <svg viewBox="0 0 400 200" className="w-full h-auto drop-shadow-2xl">
          <line x1="0" y1="160" x2="400" y2="160" stroke="#4a5568" strokeWidth="2" />
          <rect x="100" y="60" width="200" height="100" fill="rgba(249, 115, 22, 0.2)" stroke="#f97316" strokeWidth="2" strokeDasharray="4 2" />
          <line x1="100" y1="50" x2="100" y2="180" stroke="#fff" strokeWidth="4" strokeLinecap="round" />
          <line x1="200" y1="50" x2="200" y2="180" stroke="#fff" strokeWidth="4" strokeLinecap="round" />
          <line x1="300" y1="50" x2="300" y2="180" stroke="#fff" strokeWidth="4" strokeLinecap="round" />
          <g className="text-[10px] fill-white/60 font-mono">
            <line x1="80" y1="60" x2="80" y2="160" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
            <text x="50" y="115">600mm MIN</text>
            <line x1="100" y1="40" x2="200" y2="40" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
            <text x="135" y="35">3m MAX</text>
            <path d="M100 160 L100 180 L300 180 L300 160" fill="none" stroke="#f97316" strokeWidth="2" opacity="0.5" />
            <text x="170" y="195" fill="#f97316">200mm TRENCH</text>
          </g>
        </svg>
        <p className="text-[0.7rem] text-white/40 mt-3 italic leading-tight">
          Blue Book Fig 6.8: Ensure fabric is buried 200mm deep. Posts must be on the upslope side.
        </p>
      </div>
    );
  }

  if (type === 'check-dam') {
    return (
      <div className="bg-white/5 p-4 rounded-2xl border border-white/10 mb-4">
        <h4 className="text-orange-400 font-bold text-xs tracking-widest uppercase mb-4">Rock Check Dam Specs (SD 5-4)</h4>
        <svg viewBox="0 0 400 220" className="w-full h-auto drop-shadow-2xl">
          {/* Ground/Channel Bed */}
          <path d="M20 180 L380 180" fill="none" stroke="#4a5568" strokeWidth="2" />
          
          {/* Main Rock Structure (Trapezoidal Profile) */}
          <path d="M80 180 L140 100 L260 100 L320 180 Z" fill="rgba(249, 115, 22, 0.2)" stroke="#f97316" strokeWidth="2" />
          
          {/* Central Spillway (Lowered section) */}
          <path d="M160 100 L200 130 L240 100" fill="none" stroke="#f97316" strokeWidth="3" />
          <path d="M160 100 L200 130 L240 100 L240 180 L160 180 Z" fill="rgba(249, 115, 22, 0.4)" stroke="none" />
          
          {/* Geotextile Underlay */}
          <line x1="90" y1="185" x2="310" y2="185" stroke="#6366f1" strokeWidth="2" strokeDasharray="4 2" />
          
          <g className="text-[10px] fill-white/60 font-mono">
            {/* Height Indicator */}
            <line x1="130" y1="100" x2="60" y2="100" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
            <line x1="80" y1="180" x2="60" y2="180" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
            <text x="25" y="145" className="fill-orange-400">MAX 500mm</text>
            
            {/* Spillway Depth */}
            <line x1="245" y1="100" x2="270" y2="100" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
            <line x1="210" y1="130" x2="270" y2="130" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
            <text x="275" y="120" className="fill-orange-400">150mm MIN</text>
            
            {/* Spacing Label */}
            <text x="140" y="210" className="fill-blue-400">GEOTEXTILE UNDERLAY REQUIRED</text>
            
            {/* Rock Size */}
            <text x="280" y="170" className="fill-white/40">40-75mm ROCK</text>
          </g>
        </svg>
        <div className="mt-3 grid grid-cols-2 gap-2">
          <div className="bg-orange-500/10 p-2 rounded border border-orange-500/20">
            <p className="text-[0.6rem] font-bold text-orange-400 uppercase">Flow Check</p>
            <p className="text-[0.6rem] text-white/80">Centre must be lower than edges to prevent end-scour.</p>
          </div>
          <div className="bg-blue-500/10 p-2 rounded border border-blue-500/20">
            <p className="text-[0.6rem] font-bold text-blue-400 uppercase">Spillway</p>
            <p className="text-[0.6rem] text-white/80">Spillway must be level with the upstream toe of the next dam.</p>
          </div>
        </div>
        <p className="text-[0.7rem] text-white/40 mt-3 italic leading-tight">
          Blue Book SD 5-4: Rock check dams are for concentrated flow in small channels.
        </p>
      </div>
    );
  }

  if (type === 'inlet-protection') {
    return (
      <div className="bg-white/5 p-4 rounded-2xl border border-white/10 mb-4">
        <h4 className="text-orange-400 font-bold text-xs tracking-widest uppercase mb-4">Gully Pit Inlet Protection (SD 6-11)</h4>
        <svg viewBox="0 0 400 220" className="w-full h-auto drop-shadow-2xl">
          {/* Pit / Curb Profile */}
          <path d="M20 100 L120 100 L120 180 L280 180 L280 100 L380 100" fill="none" stroke="#4a5568" strokeWidth="2" />
          
          {/* Concrete Pit Walls */}
          <rect x="120" y="100" width="160" height="80" fill="rgba(255,255,255,0.05)" />
          
          {/* Filter Medium - Aggregate/Geofabric wrap */}
          <rect x="100" y="80" width="200" height="20" rx="4" fill="rgba(249, 115, 22, 0.3)" stroke="#f97316" strokeWidth="1" />
          <path d="M100 80 L100 100 L300 100 L300 80" fill="rgba(249, 115, 22, 0.1)" stroke="#f97316" strokeDasharray="2 2" />
          
          {/* Wire Mesh / Support */}
          <line x1="100" y1="100" x2="300" y2="100" stroke="#fff" strokeWidth="1" strokeDasharray="4 2" opacity="0.4" />
          
          {/* Water Flow Indicators */}
          <path d="M50 85 Q80 85 100 90" fill="none" stroke="#60a5fa" strokeWidth="2" markerEnd="url(#arrow)" />
          <path d="M350 85 Q320 85 300 90" fill="none" stroke="#60a5fa" strokeWidth="2" markerEnd="url(#arrow)" />
          
          <defs>
            <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#60a5fa" />
            </marker>
          </defs>
          
          <g className="text-[10px] fill-white/60 font-mono">
            <text x="110" y="70" className="fill-orange-400">GEOTEXTILE & AGGREGATE</text>
            <text x="145" y="145">INTERNAL SUMP (CLEAR)</text>
            
            {/* Overflow path */}
            <path d="M200 80 L200 60" stroke="#f87171" strokeWidth="2" strokeDasharray="2 2" />
            <text x="180" y="55" className="fill-red-400">BYPASS PATH</text>
            
            <text x="135" y="195" className="fill-white/40 italic">20mm AGGREGATE (CLEAN)</text>
          </g>
        </svg>
        <div className="mt-3 space-y-2">
          <div className="bg-blue-500/10 p-2 rounded border border-blue-500/20">
            <p className="text-[0.6rem] font-bold text-blue-400 uppercase">Placement Rule</p>
            <p className="text-[0.6rem] text-white/80">ONLY for Sag Pits (low points). Never block 'On-Grade' pits without an alternative bypass.</p>
          </div>
          <div className="bg-red-500/10 p-2 rounded border border-red-500/20">
            <p className="text-[0.6rem] font-bold text-red-400 uppercase">Warning</p>
            <p className="text-[0.6rem] text-white/80">Ensure barrier height is lower than the curb/property level to prevent flooding.</p>
          </div>
        </div>
        <p className="text-[0.7rem] text-white/40 mt-3 italic leading-tight">
          Blue Book SD 6-11: Geotextile must be securely fastened to prevent it washing into the pit.
        </p>
      </div>
    );
  }

  return null;
}
