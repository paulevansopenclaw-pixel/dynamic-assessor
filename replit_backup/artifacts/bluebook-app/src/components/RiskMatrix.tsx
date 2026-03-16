import React from 'react';
import { calculateRisk, cn } from '@/lib/utils';

interface RiskMatrixProps {
  likelihood: number;
  consequence: number;
  onChange: (l: number, c: number) => void;
}

export function RiskMatrix({ likelihood, consequence, onChange }: RiskMatrixProps) {
  const lLabels = ["1. Rare", "2. Unlikely", "3. Possible", "4. Likely", "5. Almost Certain"];
  const cLabels = ["1. Insignificant", "2. Minor", "3. Moderate", "4. Major", "5. Catastrophic"];

  const currentRisk = calculateRisk(likelihood, consequence);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-3 p-4 border-2 border-foreground bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <div className="flex justify-between items-end">
            <label className="font-display text-lg uppercase tracking-wide">Likelihood</label>
            <span className="font-sans font-bold text-xl">{likelihood}</span>
          </div>
          <input 
            type="range" 
            min="1" max="5" 
            value={likelihood}
            onChange={(e) => onChange(parseInt(e.target.value), consequence)}
            className="w-full h-4 bg-muted accent-primary cursor-pointer border-2 border-foreground rounded-none appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-8 [&::-webkit-slider-thumb]:h-8 [&::-webkit-slider-thumb]:bg-foreground [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-primary"
          />
          <p className="text-sm font-sans font-medium text-muted-foreground">{lLabels[likelihood-1]}</p>
        </div>

        <div className="space-y-3 p-4 border-2 border-foreground bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <div className="flex justify-between items-end">
            <label className="font-display text-lg uppercase tracking-wide">Consequence</label>
            <span className="font-sans font-bold text-xl">{consequence}</span>
          </div>
          <input 
            type="range" 
            min="1" max="5" 
            value={consequence}
            onChange={(e) => onChange(likelihood, parseInt(e.target.value))}
            className="w-full h-4 bg-muted accent-primary cursor-pointer border-2 border-foreground rounded-none appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-8 [&::-webkit-slider-thumb]:h-8 [&::-webkit-slider-thumb]:bg-foreground [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-primary"
          />
          <p className="text-sm font-sans font-medium text-muted-foreground">{cLabels[consequence-1]}</p>
        </div>
      </div>

      <div className="p-6 border-2 border-foreground bg-white shadow-hard flex flex-col items-center text-center space-y-2">
        <h4 className="font-display text-xl text-muted-foreground uppercase">Calculated Risk Rating</h4>
        <div className={cn("text-5xl font-display px-8 py-4 border-4 border-foreground shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] uppercase tracking-wider", currentRisk.color)}>
          {currentRisk.rating} - {currentRisk.level}
        </div>
      </div>
    </div>
  );
}
