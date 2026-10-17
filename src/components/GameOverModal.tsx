import React, { useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { Player, GameMode } from '../types';
import { Trophy, RotateCcw, Eye, Sparkles, Bot, PartyPopper } from 'lucide-react';

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
  const isDraw = winner === 'draw';
  const isPlayerWinner =
    gameMode === 'pve' ? winner === playerSide : winner !== null && winner !== 'draw';

  // Trigger celebration fireworks & confetti bursts
  const triggerFireworks = useCallback(() => {
    // Stage 1: Big corner cannon blasts
    confetti({
      particleCount: 70,
      angle: 60,
      spread: 70,
      origin: { x: 0.05, y: 0.75 },
      colors: ['#f59e0b', '#3b82f6', '#10b981', '#ec4899', '#8b5cf6', '#ef4444'],
      zIndex: 99999,
    });
    confetti({
      particleCount: 70,
      angle: 120,
      spread: 70,
      origin: { x: 0.95, y: 0.75 },
      colors: ['#f59e0b', '#3b82f6', '#10b981', '#ec4899', '#8b5cf6', '#ef4444'],
      zIndex: 99999,
    });

    // Stage 2: Central golden star blast
    setTimeout(() => {
      confetti({
        particleCount: 50,
        spread: 100,
        origin: { x: 0.5, y: 0.45 },
        shapes: ['star', 'circle'],
        colors: ['#fbbf24', '#f59e0b', '#fef08a', '#ffffff'],
        scalar: 1.2,
        zIndex: 99999,
      });
    }, 250);

    // Stage 3: Dynamic cascading sky fireworks for 2.5 seconds
    const duration = 2500;
    const end = Date.now() + duration;

    const interval: ReturnType<typeof setInterval> = setInterval(() => {
      const timeLeft = end - Date.now();
      if (timeLeft <= 0) {
        clearInterval(interval);
        return;
      }
      const particleCount = Math.floor(35 * (timeLeft / duration));
      confetti({
        particleCount,
        startVelocity: 30,
        spread: 360,
        ticks: 60,
        origin: {
          x: Math.random() * 0.6 + 0.2, // between 0.2 and 0.8
          y: Math.random() * 0.4 + 0.1, // upper half
        },
        colors: ['#38bdf8', '#fbbf24', '#34d399', '#f43f5e', '#a855f7'],
        zIndex: 99999,
      });
    }, 350);
  }, []);

  // Launch fireworks automatically when modal opens for winner
  useEffect(() => {
    if (isOpen && winner && isPlayerWinner && !isDraw) {
      triggerFireworks();
    }

    return () => {
      // Clear confetti canvas on unmount or close
      confetti.reset();
    };
  }, [isOpen, winner, isPlayerWinner, isDraw, triggerFireworks]);

  if (!isOpen || !winner) return null;

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
          <p className="text-xs sm:text-sm text-slate-400 mb-5 leading-relaxed">
            {subtitle}
          </p>

          {/* Re-trigger Confetti Button for Winner */}
          {isPlayerWinner && !isDraw && (
            <div className="mb-4">
              <button
                type="button"
                onClick={triggerFireworks}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-amber-300 bg-amber-950/60 hover:bg-amber-900/60 border border-amber-500/40 transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-xs"
                title="Bắn thêm pháo hoa ăn mừng"
              >
                <PartyPopper className="w-3.5 h-3.5 text-amber-400" />
                <span>Bắn pháo hoa ăn mừng 🎉</span>
              </button>
            </div>
          )}

          <div className="flex flex-col gap-2.5">
            <button
              id="btn-new-game-modal"
              type="button"
              onClick={onNewGame}
              className="w-full py-3 px-4 rounded-xl font-bold text-sm bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-md active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Chơi ván mới ngay</span>
            </button>

            <button
              id="btn-inspect-board-modal"
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
