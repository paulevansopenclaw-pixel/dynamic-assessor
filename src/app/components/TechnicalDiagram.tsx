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
          <path d="M50 160 L150 160 L200 80 L250 160 L350 160" fill="none" stroke="#4a5568" strokeWidth="2" />
          <path d="M160 160 L200 100 L240 160 Z" fill="rgba(249, 115, 22, 0.3)" stroke="#f97316" strokeWidth="2" />
          <g className="text-[10px] fill-white/60 font-mono">
            <line x1="200" y1="100" x2="200" y2="160" stroke="rgba(255,255,255,0.3)" strokeWidth="1" strokeDasharray="2 2" />
            <text x="210" y="130">500mm MAX HT</text>
            <line x1="160" y1="175" x2="240" y2="175" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
            <text x="175" y="190">CENTRE LOWER</text>
          </g>
        </svg>
        <p className="text-[0.7rem] text-white/40 mt-3 italic leading-tight">
          Blue Book Fig 5.4: Spillway must be 150mm lower than edges to prevent bypass.
        </p>
      </div>
    );
  }

  if (type === 'inlet-protection') {
    return (
      <div className="bg-white/5 p-4 rounded-2xl border border-white/10 mb-4">
        <h4 className="text-orange-400 font-bold text-xs tracking-widest uppercase mb-4">Kerb Inlet Protection</h4>
        <svg viewBox="0 0 400 200" className="w-full h-auto drop-shadow-2xl">
          <rect x="100" y="80" width="200" height="40" fill="#333" stroke="#666" />
          <rect x="110" y="90" width="180" height="20" fill="#000" />
          <rect x="90" y="70" width="220" height="60" fill="rgba(249, 115, 22, 0.1)" stroke="#f97316" strokeWidth="2" strokeDasharray="4 4" />
          <g className="text-[10px] fill-white/60 font-mono">
            <text x="150" y="60">GEOTEXTILE WRAP</text>
            <text x="140" y="150">50mm AGGREGATE BACKING</text>
          </g>
        </svg>
        <p className="text-[0.7rem] text-white/40 mt-3 italic leading-tight">
          Blue Book Fig 6.12: Do not block entire inlet. Leave emergency overflow gap.
        </p>
      </div>
    );
  }

  return null;
}
