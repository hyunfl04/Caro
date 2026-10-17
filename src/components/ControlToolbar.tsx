import React from 'react';
import { GameMode, Difficulty, Player, CaroRule, BoardTheme } from '../types';
import {
  RotateCcw,
  Undo2,
  Redo2,
  Lightbulb,
  Bot,
  Users,
  Settings,
  Volume2,
  VolumeX,
  ShieldCheck,
  ShieldAlert,
} from 'lucide-react';

interface ControlToolbarProps {
  gameMode: GameMode;
  onSetGameMode: (mode: GameMode) => void;
  difficulty: Difficulty;
  onSetDifficulty: (diff: Difficulty) => void;
  playerSide: Player;
  onSetPlayerSide: (side: Player) => void;
  onNewGame: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onGetHint: () => void;
  canUndo: boolean;
  canRedo: boolean;
  isBotThinking: boolean;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onOpenSettings: () => void;
  rule: CaroRule;
}

export const ControlToolbar: React.FC<ControlToolbarProps> = ({
  gameMode,
  onSetGameMode,
  difficulty,
  onSetDifficulty,
  playerSide,
  onSetPlayerSide,
  onNewGame,
  onUndo,
  onRedo,
  onGetHint,
  canUndo,
  canRedo,
  isBotThinking,
  soundEnabled,
  onToggleSound,
  onOpenSettings,
  rule,
}) => {
  return (
    <div className="w-full max-w-[620px] mx-auto space-y-2.5 mt-3">
      {/* Primary Actions Row */}
      <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
        {/* New Game */}
        <button
          id="btn-new-game"
          type="button"
          onClick={onNewGame}
          className="flex-1 min-w-[120px] py-2.5 px-4 rounded-xl font-bold text-xs sm:text-sm bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-md active:scale-[0.98] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Ván mới</span>
        </button>

        {/* Hint */}
        <button
          id="btn-hint"
          type="button"
          onClick={onGetHint}
          disabled={isBotThinking}
          title="Xem gợi ý nước đi tối ưu nhất"
          className="py-2.5 px-3.5 rounded-xl font-semibold text-xs sm:text-sm bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-amber-300 border border-amber-500/40 shadow-xs active:scale-[0.98] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <Lightbulb className="w-4 h-4 text-amber-400" />
          <span>Gợi ý</span>
        </button>

        {/* Undo */}
        <button
          id="btn-undo"
          type="button"
          onClick={onUndo}
          disabled={!canUndo || isBotThinking}
          title="Đi lại nước cờ vừa đánh"
          className="py-2.5 px-3.5 rounded-xl font-semibold text-xs sm:text-sm bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-slate-200 border border-slate-700 shadow-xs active:scale-[0.98] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <Undo2 className="w-4 h-4" />
          <span className="hidden xs:inline">Đi lại</span>
        </button>

        {/* Redo */}
        <button
          id="btn-redo"
          type="button"
          onClick={onRedo}
          disabled={!canRedo || isBotThinking}
          title="Đi tiếp nước đã rút lại"
          className="py-2.5 px-3.5 rounded-xl font-semibold text-xs sm:text-sm bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-slate-200 border border-slate-700 shadow-xs active:scale-[0.98] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <Redo2 className="w-4 h-4" />
          <span className="hidden xs:inline">Đi tiếp</span>
        </button>

        {/* Sound Toggle */}
        <button
          id="btn-toggle-sound"
          type="button"
          onClick={onToggleSound}
          title={soundEnabled ? 'Tắt âm thanh' : 'Bật âm thanh'}
          className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 transition-colors cursor-pointer"
        >
          {soundEnabled ? (
            <Volume2 className="w-4 h-4 text-emerald-400" />
          ) : (
            <VolumeX className="w-4 h-4 text-slate-500" />
          )}
        </button>

        {/* Settings */}
        <button
          id="btn-settings"
          type="button"
          onClick={onOpenSettings}
          title="Tuỳ chỉnh luật, giao diện, đặt lại"
          className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 transition-colors cursor-pointer"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>

      {/* Game Mode & AI Difficulty Controls */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-2.5 flex items-center justify-between gap-2 flex-wrap">
        {/* Mode Selector */}
        <div className="flex items-center gap-1 p-0.5 bg-slate-950 border border-slate-800 rounded-lg">
          <button
            type="button"
            onClick={() => onSetGameMode('pve')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
              gameMode === 'pve'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Bot className="w-3.5 h-3.5" />
            <span>Đấu với Máy</span>
          </button>

          <button
            type="button"
            onClick={() => onSetGameMode('pvp')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
              gameMode === 'pvp'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>2 Người Chơi</span>
          </button>
        </div>

        {/* AI Difficulty (Only shown in PvE) */}
        {gameMode === 'pve' && (
          <div className="flex items-center gap-1">
            <span className="text-[11px] text-slate-400 mr-1 hidden sm:inline">Cấp độ:</span>
            {[
              { id: 'easy', label: 'Dễ' },
              { id: 'medium', label: 'Trung Bình' },
              { id: 'hard', label: 'Khó (Master)' },
            ].map((diff) => (
              <button
                key={diff.id}
                type="button"
                onClick={() => onSetDifficulty(diff.id as Difficulty)}
                className={`px-2.5 py-1 rounded text-xs font-medium transition-colors cursor-pointer ${
                  difficulty === diff.id
                    ? 'bg-slate-800 text-amber-300 font-bold border border-amber-500/40'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {diff.label}
              </button>
            ))}
          </div>
        )}

        {/* Player Side Pick (Only in PvE) */}
        {gameMode === 'pve' && (
          <div className="flex items-center gap-1 text-[11px]">
            <span className="text-slate-400 hidden sm:inline">Bạn cầm:</span>
            <button
              type="button"
              onClick={() => onSetPlayerSide('X')}
              className={`px-2 py-0.5 rounded font-bold cursor-pointer transition-colors ${
                playerSide === 'X'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white bg-slate-950'
              }`}
            >
              X (Đi trước)
            </button>
            <button
              type="button"
              onClick={() => onSetPlayerSide('O')}
              className={`px-2 py-0.5 rounded font-bold cursor-pointer transition-colors ${
                playerSide === 'O'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white bg-slate-950'
              }`}
            >
              O (Đi sau)
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
