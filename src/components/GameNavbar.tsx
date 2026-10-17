import React from 'react';
import { GameMode, Difficulty } from '../types';
import { Bot, Users, RotateCcw, Settings, Volume2, VolumeX } from 'lucide-react';

interface GameNavbarProps {
  gameMode: GameMode;
  difficulty: Difficulty;
  onNewGame: () => void;
  onOpenSettings: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

export const GameNavbar: React.FC<GameNavbarProps> = ({
  gameMode,
  difficulty,
  onNewGame,
  onOpenSettings,
  soundEnabled,
  onToggleSound,
}) => {
  return (
    <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Zone 1: Single text element wordmark */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-500 to-amber-600 flex items-center justify-center text-white font-black text-base shadow-xs">
              #
            </div>
            <a href="/" className="text-base sm:text-lg font-extrabold text-white tracking-tight">
              Cờ Ca Rô
            </a>
          </div>

          {/* Zone 2: Game Mode & Difficulty Information */}
          <div className="hidden sm:flex items-center gap-3 text-xs text-slate-400 font-medium">
            <span className="flex items-center gap-1.5 text-slate-300">
              {gameMode === 'pve' ? (
                <>
                  <Bot className="w-3.5 h-3.5 text-amber-400" />
                  <span>Đấu với Máy ({difficulty === 'easy' ? 'Dễ' : difficulty === 'medium' ? 'Trung Bình' : 'Khó'})</span>
                </>
              ) : (
                <>
                  <Users className="w-3.5 h-3.5 text-blue-400" />
                  <span>2 Người Chơi</span>
                </>
              )}
            </span>
            <span className="text-slate-600">·</span>
            <span>Bàn cờ 15x15</span>
          </div>

          {/* Zone 3: Actions */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onToggleSound}
              className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
              title={soundEnabled ? 'Tắt âm thanh' : 'Bật âm thanh'}
            >
              {soundEnabled ? (
                <Volume2 className="w-4 h-4 text-emerald-400" />
              ) : (
                <VolumeX className="w-4 h-4 text-slate-500" />
              )}
            </button>

            <button
              type="button"
              onClick={onOpenSettings}
              className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
              title="Cài đặt & Luật chơi"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
