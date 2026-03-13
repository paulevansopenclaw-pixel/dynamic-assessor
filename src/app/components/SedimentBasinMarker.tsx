"use client";

interface MarkerProps {
  fillLevel: number; // 0 to 100
}

export default function SedimentBasinMarker({ fillLevel }: MarkerProps) {
  const isCritical = fillLevel >= 50;

  return (
    <div className="bg-white/5 p-6 rounded-3xl border border-white/10 mb-6 shadow-inner">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h4 className="text-orange-400 font-bold text-xs tracking-widest uppercase">Maintenance Trigger</h4>
          <p className="text-[0.65rem] text-white/40 font-mono mt-1">Blue Book Standard Drawing SD 6-1</p>
        </div>
        <div className={`px-3 py-1 rounded-full text-[0.6rem] font-black tracking-tighter border ${isCritical ? "bg-red-500/20 text-red-400 border-red-500/30 animate-pulse" : "bg-green-500/20 text-green-400 border-green-500/30"}`}>
          {isCritical ? "CLEAN-OUT REQUIRED" : "COMPLIANT"}
        </div>
      </div>

      <div className="flex gap-8 items-end justify-center py-4">
        {/* The Marker Peg Visual */}
        <div className="relative h-48 w-12 bg-neutral-800 rounded-t-lg border-x border-t border-white/10 flex flex-col justify-end overflow-hidden">
          {/* Silt Level */}
          <div 
            className={`w-full transition-all duration-1000 ease-out ${isCritical ? "bg-orange-600/60" : "bg-blue-600/40"}`}
            style={{ height: `${fillLevel}%` }}
          >
            <div className="w-full h-1 bg-white/20"></div>
          </div>
          
          {/* 50% Marker Line */}
          <div className="absolute bottom-1/2 w-full h-0.5 bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)] z-10"></div>
          <div className="absolute bottom-[52%] left-full ml-2 whitespace-nowrap text-[0.5rem] font-bold text-red-500 uppercase tracking-widest">
            50% Trigger Peg
          </div>
        </div>

        {/* Technical Data Card */}
        <div className="flex-1 space-y-3">
          <div className="bg-black/40 p-3 rounded-xl border border-white/5">
            <span className="block text-[0.5rem] text-white/30 uppercase font-bold tracking-widest">Current Storage</span>
            <span className={`text-xl font-black ${isCritical ? "text-red-400" : "text-white"}`}>{fillLevel}%</span>
          </div>
          <div className="text-[0.65rem] text-white/60 leading-relaxed italic">
            "Sediment basins must be cleaned out when the settled sediment occupies 50% of the sediment storage zone."
          </div>
        </div>
      </div>
    </div>
  );
}
