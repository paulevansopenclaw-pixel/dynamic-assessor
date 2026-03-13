"use client";

export default function VideoSandbox() {
  return (
    <div className="bg-black/40 p-4 rounded-2xl border border-white/10 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-orange-400 font-bold text-xs tracking-widest uppercase">Field Comparison</h4>
        <span className="bg-red-500/10 text-red-500 text-[0.6rem] px-2 py-0.5 rounded-full font-black border border-red-500/20">LIVE STANDARDS</span>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        {/* Good Practice */}
        <div className="space-y-2">
          <div className="aspect-video bg-green-500/10 rounded-xl border border-green-500/20 flex items-center justify-center relative overflow-hidden group">
            <div className="absolute top-2 left-2 bg-green-500 text-black text-[0.5rem] font-black px-1.5 py-0.5 rounded">GOOD</div>
            <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="text-green-500"><polygon points="5 3 19 12 5 21 5 3"/></svg>
            </div>
          </div>
          <p className="text-[0.6rem] text-white/40 leading-tight">Correct trenching and post placement.</p>
        </div>

        {/* Bad Practice */}
        <div className="space-y-2">
          <div className="aspect-video bg-red-500/10 rounded-xl border border-red-500/20 flex items-center justify-center relative overflow-hidden group">
            <div className="absolute top-2 left-2 bg-red-500 text-white text-[0.5rem] font-black px-1.5 py-0.5 rounded">BAD</div>
            <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="text-red-500"><polygon points="5 3 19 12 5 21 5 3"/></svg>
            </div>
          </div>
          <p className="text-[0.6rem] text-white/40 leading-tight">Fabric bypass and shallow bury depth.</p>
        </div>
      </div>
    </div>
  );
}
