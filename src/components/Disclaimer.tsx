import React from 'react';
import { AlertTriangle } from 'lucide-react';

export const Disclaimer: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`flex items-start gap-3 rounded-xl border border-amber-500/20 bg-amber-500/10 px-4 py-3 text-amber-200/90 text-xs leading-relaxed ${className}`}>
      <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
      <p>
        <span className="font-semibold text-amber-300">Cognitive Training Reference:</span> Fovea is a reading and visual-attention exercise tool. It is for educational & self-improvement purposes and is not a medical device. Consult an eye-care professional if you experience eye strain, headaches, or vision changes.
      </p>
    </div>
  );
};
