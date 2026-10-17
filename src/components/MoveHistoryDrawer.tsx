import React, { useState } from 'react';
import { Move } from '../types';
import { History, ChevronDown, ChevronUp } from 'lucide-react';

interface MoveHistoryDrawerProps {
  moves: Move[];
}

export const MoveHistoryDrawer: React.FC<MoveHistoryDrawerProps> = ({ moves }) => {
  const [isOpen, setIsOpen] = useState(false);

  if (moves.length === 0) return null;

  return (
    <div className="w-full max-w-[620px] mx-auto mt-2 bg-slate-900/80 rounded-xl border border-slate-800 overflow-hidden shadow-xs">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-3.5 py-2 flex items-center justify-between text-xs font-semibold text-slate-300 hover:bg-slate-800/60 transition-colors cursor-pointer"
      >
        <div className="flex items-center gap-2">
          <History className="w-3.5 h-3.5 text-amber-400" />
          <span>Lịch sử nước cờ ({moves.length} nước)</span>
          {moves.length > 0 && (
            <span className="text-[11px] font-mono text-slate-400">
              · Nước cuối: {moves[moves.length - 1].player} ({moves[moves.length - 1].notation})
            </span>
          )}
        </div>
        {isOpen ? (
          <ChevronUp className="w-4 h-4 text-slate-400" />
        ) : (
          <ChevronDown className="w-4 h-4 text-slate-400" />
        )}
      </button>

      {isOpen && (
        <div className="p-3 max-h-40 overflow-y-auto border-t border-slate-800 bg-slate-950/60">
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-1.5 text-xs font-mono">
            {moves.map((m) => (
              <div
                key={`m-${m.index}`}
                className="flex items-center justify-between px-2 py-1 bg-slate-900 border border-slate-800 rounded shadow-2xs"
              >
                <span className="text-slate-500 text-[10px]">#{m.index}</span>
                <span
                  className={`font-bold ${
                    m.player === 'X' ? 'text-blue-400' : 'text-rose-400'
                  }`}
                >
                  {m.player}
                </span>
                <span className="text-slate-300 font-semibold">{m.notation}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
