import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BoardTheme, CaroRule } from '../types';
import { X, Palette, ShieldAlert, ShieldCheck, RotateCcw, BookOpen } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: BoardTheme;
  onSetTheme: (theme: BoardTheme) => void;
  rule: CaroRule;
  onSetRule: (rule: CaroRule) => void;
  onResetStats: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  theme,
  onSetTheme,
  rule,
  onSetRule,
  onResetStats,
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 15 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 15 }}
          className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-2xl max-h-[90vh] overflow-y-auto space-y-5"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="font-extrabold text-base sm:text-lg text-white">
              Cài Đặt Trò Chơi & Luật Cờ
            </h3>
            <button
              type="button"
              onClick={onClose}
              className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Theme Selector */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Palette className="w-4 h-4 text-amber-400" />
              <span>Giao Diện Bàn Cờ:</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'wood', label: 'Bàn Gỗ', desc: 'Gỗ sáng cổ điển' },
                { id: 'slate', label: 'Đá Slate', desc: 'Đen tương phản' },
                { id: 'parchment', label: 'Giấy Bìa', desc: 'Ấm áp thanh lịch' },
              ].map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => onSetTheme(t.id as BoardTheme)}
                  className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                    theme === t.id
                      ? 'bg-amber-950/40 border-amber-500/70 text-amber-300 font-bold'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <span className="text-xs block mb-0.5">{t.label}</span>
                  <span className="text-[10px] text-slate-400 block">{t.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Caro Rules Selector */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-cyan-400" />
              <span>Luật Chơi Cờ Ca Rô:</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => onSetRule('blocked_ends')}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  rule === 'blocked_ends'
                    ? 'bg-cyan-950/40 border-cyan-500/70 text-cyan-300 font-bold'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <ShieldAlert className="w-4 h-4 text-amber-400" />
                  <span className="text-xs">Chặn 2 đầu</span>
                </div>
                <span className="text-[11px] text-slate-400 block leading-tight font-normal">
                  Chuỗi 5 quân bị đối phương chặn cả 2 đầu không thắng (Luật Việt Nam).
                </span>
              </button>

              <button
                type="button"
                onClick={() => onSetRule('standard')}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  rule === 'standard'
                    ? 'bg-cyan-950/40 border-cyan-500/70 text-cyan-300 font-bold'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs">5 ô tự do</span>
                </div>
                <span className="text-[11px] text-slate-400 block leading-tight font-normal">
                  Chỉ cần đủ 5 quân liên tiếp bất kỳ là thắng (Luật Gomoku quốc tế).
                </span>
              </button>
            </div>
          </div>

          {/* Reset Stats */}
          <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
            <span className="text-xs text-slate-400">Đặt lại toàn bộ số trận thắng/thua:</span>
            <button
              type="button"
              onClick={onResetStats}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-rose-400 hover:bg-rose-950/50 border border-rose-900/60 transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Xóa thống kê</span>
            </button>
          </div>

          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-colors cursor-pointer"
          >
            Đóng Cài Đặt
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
