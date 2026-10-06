import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Player, GameMode } from '../types';
import { Trophy, RotateCcw, Eye, Sparkles, Frown, Bot, User } from 'lucide-react';

interface GameOverModalProps {
  winner: Player | 'draw' | null;
  isOpen: boolean;
  gameMode: GameMode;
  playerSide: Player;
  player1Name: string;
  player2Name: string;
  moveCount: number;
  onNewGame: () => void;
  onClose: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  winner,
  isOpen,
  gameMode,
  playerSide,
  player1Name,
  player2Name,
  moveCount,
  onNewGame,
  onClose,
}) => {
  if (!isOpen || !winner) return null;

  const isDraw = winner === 'draw';
  const isPlayerWinner =
    gameMode === 'pve' ? winner === playerSide : winner === 'X';

  let title = '';
  let subtitle = '';

  if (isDraw) {
    title = 'Trận Đấu Bất Phân Thắng Bại!';
    subtitle = `Bàn cờ đã kín các ô mà không bên nào tạo được 5 quân liên tiếp sau ${moveCount} nước đi.`;
  } else if (gameMode === 'pve') {
    if (isPlayerWinner) {
      title = 'Chúc Mừng! Bạn Đã Chiến Thắng!';
      subtitle = `Bạn đã xuất sắc đánh bại Máy sau ${moveCount} nước cờ đầy kịch tính!`;
    } else {
      title = 'Máy Đã Giành Chiến Thắng!';
      subtitle = `Máy đã tạo thành chuỗi 5 ô chiến thắng sau ${moveCount} nước đi. Hãy thử lại ván mới nhé!`;
    }
  } else {
    const winnerName = winner === 'X' ? player1Name : player2Name;
    title = `${winnerName} Chiến Thắng!`;
    subtitle = `Bên ${winner} đã tạo thành chuỗi 5 ô liên tiếp sau ${moveCount} nước cờ.`;
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
        <motion.div
          initial={{ scale: 0.85, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.85, opacity: 0, y: 20 }}
          transition={{ type: 'spring', stiffness: 380, damping: 25 }}
          className="relative w-full max-w-sm bg-slate-900 border border-slate-800 rounded-3xl p-6 text-center shadow-2xl overflow-hidden"
        >
          {/* Festive top glow */}
          <div
            className={`absolute -top-16 left-1/2 -translate-x-1/2 w-48 h-48 rounded-full blur-3xl opacity-20 pointer-events-none ${
              isDraw
                ? 'bg-amber-400'
                : isPlayerWinner
                ? 'bg-emerald-500'
                : 'bg-rose-500'
            }`}
          />

          {/* Badge Icon */}
          <div className="mx-auto mb-4 relative">
            <div
              className={`w-16 h-16 mx-auto rounded-2xl flex items-center justify-center shadow-lg ${
                isDraw
                  ? 'bg-amber-950/80 border border-amber-500/40 text-amber-400'
                  : isPlayerWinner
                  ? 'bg-gradient-to-br from-emerald-500 to-teal-700 text-white shadow-emerald-950/50'
                  : 'bg-gradient-to-br from-rose-500 to-red-800 text-white shadow-rose-950/50'
              }`}
            >
              {isDraw ? (
                <Trophy className="w-8 h-8" />
              ) : isPlayerWinner ? (
                <Trophy className="w-8 h-8" />
              ) : (
                <Bot className="w-8 h-8" />
              )}
            </div>

            {isPlayerWinner && !isDraw && (
              <div className="absolute -top-1 right-20 animate-pulse">
                <Sparkles className="w-5 h-5 text-amber-400 fill-amber-300" />
              </div>
            )}
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight mb-2">
            {title}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mb-6 leading-relaxed">
            {subtitle}
          </p>

          <div className="flex flex-col gap-2.5">
            <button
              type="button"
              onClick={onNewGame}
              className="w-full py-3 px-4 rounded-xl font-bold text-sm bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-md active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Chơi ván mới ngay</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="w-full py-2.5 px-4 rounded-xl font-semibold text-xs text-slate-400 hover:text-white hover:bg-slate-800 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Eye className="w-4 h-4" />
              <span>Xem lại thế cờ vừa kết thúc</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
