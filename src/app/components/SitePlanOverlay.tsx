"use client";

import { useState, useRef } from "react";

interface ControlIcon {
  id: number;
  type: 'sediment-fence' | 'check-dam' | 'exit';
  x: number;
  y: number;
  label: string;
}

export default function SitePlanOverlay() {
  const [icons, setIcons] = useState<ControlIcon[]>([]);
  const [bgImage, setBgImage] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => setBgImage(event.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const addIcon = (type: ControlIcon['type']) => {
    const newIcon: ControlIcon = {
      id: Date.now(),
      type,
      x: 50,
      y: 50,
      label: type === 'sediment-fence' ? 'SD 6-8' : type === 'check-dam' ? 'SD 5-4' : 'SD 7-1'
    };
    setIcons([...icons, newIcon]);
  };

  const updatePosition = (id: number, x: number, y: number) => {
    setIcons(icons.map(icon => icon.id === id ? { ...icon, x, y } : icon));
  };

  return (
    <div className="flex flex-col gap-4 p-4 bg-black/20 rounded-3xl border border-white/10">
      <div className="flex justify-between items-center">
        <h3 className="text-orange-400 font-bold uppercase tracking-tighter">Blue Book Overlay Tool</h3>
        <label className="bg-white/10 px-4 py-2 rounded-xl cursor-pointer hover:bg-white/20 transition-all text-xs">
          Upload Site Plan
          <input type="file" className="hidden" onChange={handleUpload} />
        </label>
      </div>

      <div 
        ref={containerRef}
        className="relative w-full aspect-[4/3] bg-white/5 rounded-2xl overflow-hidden border border-white/5 shadow-inner cursor-crosshair"
      >
        {bgImage && <img src={bgImage} className="w-full h-full object-contain opacity-60" alt="Site Plan" />}
        
        {icons.map(icon => (
          <div 
            key={icon.id}
            style={{ left: `${icon.x}%`, top: `${icon.y}%` }}
            className={`absolute -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center text-[8px] font-black shadow-lg cursor-move border-2
              ${icon.type === 'sediment-fence' ? 'bg-orange-500 border-orange-200 text-white' : 
                icon.type === 'check-dam' ? 'bg-blue-500 border-blue-200 text-white' : 
                'bg-green-500 border-green-200 text-white'}`}
            onMouseDown={(e) => {
              const move = (moveEvent: MouseEvent) => {
                const rect = containerRef.current!.getBoundingClientRect();
                const newX = ((moveEvent.clientX - rect.left) / rect.width) * 100;
                const newY = ((moveEvent.clientY - rect.top) / rect.height) * 100;
                updatePosition(icon.id, Math.max(0, Math.min(100, newX)), Math.max(0, Math.min(100, newY)));
              };
              window.addEventListener('mousemove', move);
              window.addEventListener('mouseup', () => window.removeEventListener('mousemove', move), { once: true });
            }}
          >
            {icon.label}
          </div>
        ))}

        {!bgImage && (
          <div className="absolute inset-0 flex items-center justify-center text-white/20 text-xs italic">
            No plan uploaded
          </div>
        )}
      </div>
      
      <div className="text-[10px] text-white/40 italic leading-tight">
        Drag icons to position. Wolf will automatically check catchment areas and slope compliance based on RL contours.
      </div>
    </div>
  );
}
