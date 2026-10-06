import React from 'react';
import { Player, GameMode, Difficulty, GameStats } from '../types';
import { Bot, User, Swords, Zap, Brain, Flame } from 'lucide-react';

interface ScoreCardProps {
  gameMode: GameMode;
  difficulty: Difficulty;
  currentPlayer: Player;
  playerSide: Player;
  stats: GameStats;
  isBotThinking: boolean;
  player1Name: string;
  player2Name: string;
  onUpdatePlayerName: (player: Player, name: string) => void;
  winner: Player | 'draw' | null;
  moveCount: number;
}

export const ScoreCard: React.FC<ScoreCardProps> = ({
  gameMode,
  difficulty,
  currentPlayer,
  playerSide,
  stats,
  isBotThinking,
  player1Name,
  player2Name,
  onUpdatePlayerName,
  winner,
  moveCount,
}) => {
  const isXTurn = currentPlayer === 'X' && !winner;
  const isOTurn = currentPlayer === 'O' && !winner;

  // Identify who is X and who is O in PvE
  const isPlayerX = gameMode === 'pve' ? playerSide === 'X' : true;
  const isBotX = gameMode === 'pve' ? playerSide === 'O' : false;

  const leftIsPlayer = isPlayerX;
  const rightIsBot = gameMode === 'pve';

  const leftName = gameMode === 'pve' ? (leftIsPlayer ? player1Name : 'Máy') : player1Name;
  const rightName = gameMode === 'pve' ? (rightIsBot ? `Máy (${difficulty.toUpperCase()})` : player1Name) : player2Name;

  const leftWins = gameMode === 'pve' ? stats.pvePlayerWins : stats.pvpXWins;
  const rightWins = gameMode === 'pve' ? stats.pveBotWins : stats.pvpOWins;

  return (
    <div className="w-full max-w-[620px] mx-auto bg-slate-900/90 backdrop-blur-md rounded-2xl p-3 sm:p-4 border border-slate-800 shadow-sm mb-3">
      <div className="flex items-center justify-between gap-2 sm:gap-4">
        {/* Left Contender (X) */}
        <div
          id="player-x-box"
          className={`flex-1 flex items-center gap-2.5 p-2 sm:p-2.5 rounded-xl border transition-all duration-200 ${
            isXTurn
              ? 'bg-blue-950/40 border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.25)] ring-1 ring-blue-500/50'
              : 'bg-slate-950/40 border-slate-800/80 opacity-80'
          }`}
        >
          {/* Avatar Icon */}
          <div className="relative shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-700 text-white flex items-center justify-center font-black text-lg shadow-sm">
            <span>X</span>
            {isXTurn && (
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
              </span>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              {gameMode === 'pve' && !leftIsPlayer ? (
                <span className="font-bold text-slate-200 text-xs sm:text-sm truncate flex items-center gap-1">
                  <Bot className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Máy</span>
                </span>
              ) : (
                <input
                  type="text"
                  value={player1Name}
                  onChange={(e) => onUpdatePlayerName('X', e.target.value)}
                  maxLength={15}
                  disabled={gameMode === 'pve' && !leftIsPlayer}
                  className="font-bold text-slate-200 text-xs sm:text-sm truncate w-full bg-transparent hover:bg-slate-800 focus:bg-slate-800 px-1 py-0.5 rounded border border-transparent focus:border-blue-400 focus:outline-none transition-colors"
                />
              )}
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-0.5">
              <span>Thắng:</span>
              <span className="font-mono font-bold text-blue-400 tabular-nums">{leftWins}</span>
              {isXTurn && (
                <span className="ml-1 px-1.5 py-0.2 text-[10px] font-semibold bg-blue-900/60 text-blue-300 rounded border border-blue-500/30">
                  Lượt đi
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Center VS & Score Header */}
        <div className="flex flex-col items-center justify-center px-1 sm:px-2 text-center shrink-0">
          <div className="flex items-center gap-1 text-slate-400 mb-0.5">
            <Swords className="w-3.5 h-3.5 text-amber-500" />
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
              {gameMode === 'pve' ? 'Người vs Máy' : '2 Người'}
            </span>
          </div>

          <div className="text-base sm:text-xl font-black text-white tracking-wider font-mono tabular-nums">
            {leftWins} - {rightWins}
          </div>

          <div className="text-[10px] text-slate-400 font-mono">
            Nước: <span className="font-bold text-slate-200">{moveCount}</span>
            {stats.draws > 0 && <span className="ml-1">· Hòa: {stats.draws}</span>}
          </div>

          {gameMode === 'pve' && stats.streak > 1 && (
            <div className="mt-1 flex items-center gap-0.5 text-[10px] font-bold text-amber-400 bg-amber-950/60 border border-amber-500/30 px-1.5 py-0.2 rounded-full">
              <Flame className="w-2.5 h-2.5 text-amber-400" />
              <span>Chuỗi {stats.streak}</span>
            </div>
          )}
        </div>

        {/* Right Contender (O) */}
        <div
          id="player-o-box"
          className={`flex-1 flex items-center justify-end gap-2.5 p-2 sm:p-2.5 rounded-xl border transition-all duration-200 text-right ${
            isOTurn
              ? 'bg-rose-950/40 border-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.25)] ring-1 ring-rose-500/50'
              : 'bg-slate-950/40 border-slate-800/80 opacity-80'
          }`}
        >
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-end gap-1.5">
              {gameMode === 'pve' && rightIsBot ? (
                <span className="font-bold text-slate-200 text-xs sm:text-sm truncate flex items-center justify-end gap-1">
                  <Bot className="w-3.5 h-3.5 text-rose-400" />
                  <span>Máy ({difficulty === 'easy' ? 'Dễ' : difficulty === 'medium' ? 'TB' : 'Khó'})</span>
                </span>
              ) : (
                <input
                  type="text"
                  value={player2Name}
                  onChange={(e) => onUpdatePlayerName('O', e.target.value)}
                  maxLength={15}
                  className="font-bold text-slate-200 text-xs sm:text-sm truncate w-full text-right bg-transparent hover:bg-slate-800 focus:bg-slate-800 px-1 py-0.5 rounded border border-transparent focus:border-rose-400 focus:outline-none transition-colors"
                />
              )}
            </div>

            <div className="flex items-center justify-end gap-1.5 text-[11px] text-slate-400 mt-0.5">
              {isOTurn && (
                <span className="mr-1 px-1.5 py-0.2 text-[10px] font-semibold bg-rose-900/60 text-rose-300 rounded border border-rose-500/30">
                  {isBotThinking ? 'Đang nghĩ...' : 'Lượt đi'}
                </span>
              )}
              <span>Thắng:</span>
              <span className="font-mono font-bold text-rose-400 tabular-nums">{rightWins}</span>
            </div>
          </div>

          {/* Avatar Icon */}
          <div className="relative shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500 to-red-700 text-white flex items-center justify-center font-black text-lg shadow-sm">
            <span>O</span>
            {isOTurn && (
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
