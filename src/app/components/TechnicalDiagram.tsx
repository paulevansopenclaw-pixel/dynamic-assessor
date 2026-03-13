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
        <h4 className="text-orange-400 font-bold text-xs tracking-widest uppercase mb-4">Rock Check Dam Specs</h4>
        <svg viewBox="0 0 400 200" className="w-full h-auto drop-shadow-2xl">
          {/* Channel Bed */}
          <path d="M20 160 L380 160" fill="none" stroke="#4a5568" strokeWidth="2" />
          {/* Main Rock Pile */}
          <path d="M120 160 L200 80 L280 160 Z" fill="rgba(249, 115, 22, 0.3)" stroke="#f97316" strokeWidth="2" />
          {/* Central Spillway Detail */}
          <path d="M160 160 L200 100 L240 160 Z" fill="rgba(249, 115, 22, 0.4)" stroke="#f97316" strokeWidth="1" />
          
          <g className="text-[10px] fill-white/60 font-mono">
            {/* Height Indicator */}
            <line x1="200" y1="80" x2="200" y2="160" stroke="rgba(255,255,255,0.3)" strokeWidth="1" strokeDasharray="2 2" />
            <text x="210" y="110">MAX HT 500mm</text>
            
            {/* Spillway Depth Indicator */}
            <path d="M200 80 L300 80" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
            <path d="M200 100 L300 100" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
            <text x="310" y="95" className="fill-orange-400">150mm SPILLWAY</text>
            
            {/* Footer Text */}
            <text x="50" y="190" className="fill-white/40 italic">Use 40-75mm clean rock or sandbags</text>
          </g>
        </svg>
        <p className="text-[0.7rem] text-white/40 mt-3 italic leading-tight">
          Blue Book SD 5-4: Centre must be lower than edges to direct flow back to channel center.
        </p>
      </div>
    );
  }

  if (type === 'inlet-protection') {
    return (
      <div className="bg-white/5 p-4 rounded-2xl border border-white/10 mb-4">
        <h4 className="text-orange-400 font-bold text-xs tracking-widest uppercase mb-4">Gully Pit Inlet Protection</h4>
        <svg viewBox="0 0 400 200" className="w-full h-auto drop-shadow-2xl">
          {/* Pit Structure */}
          <rect x="120" y="100" width="160" height="60" fill="none" stroke="#4a5568" strokeWidth="2" />
          <rect x="130" y="110" width="140" height="40" fill="#000" />
          
          {/* Sandbag / Block barrier */}
          <rect x="100" y="100" width="20" height="60" fill="rgba(249, 115, 22, 0.3)" stroke="#f97316" />
          <rect x="280" y="100" width="20" height="60" fill="rgba(249, 115, 22, 0.3)" stroke="#f97316" />
          <rect x="120" y="80" width="160" height="20" fill="rgba(249, 115, 22, 0.3)" stroke="#f97316" />
          
          {/* Aggregate filter */}
          <circle cx="200" cy="110" r="15" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.3)" strokeDasharray="2 2" />
          
          <g className="text-[10px] fill-white/60 font-mono">
            <text x="145" y="70">BLOCK & GRAVEL FILTER</text>
            <text x="160" y="135" className="fill-orange-400">20mm AGGREGATE</text>
            
            <line x1="300" y1="110" x2="350" y2="110" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
            <text x="320" y="105">SAG PIT ONLY</text>
          </g>
        </svg>
        <p className="text-[0.7rem] text-white/40 mt-3 italic leading-tight">
          Blue Book SD 6-11: Ensure internal sump is clear. Do not use for on-grade pits without bypass.
        </p>
      </div>
    );
  }

  return null;
}
