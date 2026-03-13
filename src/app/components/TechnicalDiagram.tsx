"use client";

interface DiagramProps {
  type: 'sediment-fence' | 'check-dam';
  specs?: string;
}

export default function TechnicalDiagram({ type, specs }: DiagramProps) {
  if (type === 'sediment-fence') {
    return (
      <div className="bg-white/5 p-4 rounded-2xl border border-white/10 mb-4">
        <h4 className="text-orange-400 font-bold text-xs tracking-widest uppercase mb-4">Interactive Specification</h4>
        <svg viewBox="0 0 400 200" className="w-full h-auto drop-shadow-2xl">
          {/* Ground */}
          <line x1="0" y1="160" x2="400" y2="160" stroke="#4a5568" strokeWidth="2" />
          
          {/* Fence Fabric */}
          <rect x="100" y="60" width="200" height="100" fill="rgba(249, 115, 22, 0.2)" stroke="#f97316" strokeWidth="2" strokeDasharray="4 2" />
          
          {/* Posts */}
          <line x1="100" y1="50" x2="100" y2="180" stroke="#fff" strokeWidth="4" strokeLinecap="round" />
          <line x1="200" y1="50" x2="200" y2="180" stroke="#fff" strokeWidth="4" strokeLinecap="round" />
          <line x1="300" y1="50" x2="300" y2="180" stroke="#fff" strokeWidth="4" strokeLinecap="round" />
          
          {/* Measurements */}
          <g className="text-[10px] fill-white/60 font-mono">
            {/* Height */}
            <line x1="80" y1="60" x2="80" y2="160" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
            <text x="50" y="115">600mm MIN</text>
            
            {/* Spacing */}
            <line x1="100" y1="40" x2="200" y2="40" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
            <text x="135" y="35">3m MAX</text>
            
            {/* Trench */}
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

  return null;
}
