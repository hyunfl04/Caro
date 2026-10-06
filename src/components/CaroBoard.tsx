import React from 'react';
import { motion } from 'motion/react';
import { CellValue, Player, Position, WinResult, BoardTheme } from '../types';
import { BOARD_SIZE, isStarPoint, toNotation } from '../utils/caroLogic';

interface CaroBoardProps {
  board: CellValue[][];
  currentPlayer: Player;
  onCellClick: (row: number, col: number) => void;
  winResult: WinResult | null;
  lastMove: Position | null;
  hintPos: Position | null;
  hoverPos: Position | null;
  setHoverPos: (pos: Position | null) => void;
  disabled: boolean;
  theme: BoardTheme;
  isBotThinking: boolean;
}

export const CaroBoard: React.FC<CaroBoardProps> = ({
  board,
  currentPlayer,
  onCellClick,
  winResult,
  lastMove,
  hintPos,
  hoverPos,
  setHoverPos,
  disabled,
  theme,
  isBotThinking,
}) => {
  const isWinningCell = (r: number, c: number) => {
    if (!winResult) return false;
    return winResult.winningLine.some((pos) => pos.row === r && pos.col === c);
  };

  const isLastCell = (r: number, c: number) => {
    return lastMove !== null && lastMove.row === r && lastMove.col === c;
  };

  const isHintCell = (r: number, c: number) => {
    return hintPos !== null && hintPos.row === r && hintPos.col === c;
  };

  const colLetters = Array.from({ length: BOARD_SIZE }, (_, i) => String.fromCharCode(65 + i));
  const rowNumbers = Array.from({ length: BOARD_SIZE }, (_, i) => BOARD_SIZE - i);

  // Theme styling definitions
  const themeContainerClass =
    theme === 'wood'
      ? 'border-[#8f5d2b] shadow-[0_20px_50px_rgba(70,30,10,0.35)]'
      : theme === 'slate'
      ? 'border-slate-700 shadow-[0_20px_50px_rgba(0,0,0,0.5)]'
      : 'border-amber-300 shadow-[0_20px_45px_rgba(180,140,80,0.18)]';

  const themeBoardBg =
    theme === 'wood'
      ? {
          backgroundImage:
            'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.1) 0%, rgba(0,0,0,0.15) 100%), linear-gradient(135deg, #dfa364 0%, #cf8f4e 50%, #bd7d3b 100%)',
          backgroundColor: '#cf8f4e',
        }
      : theme === 'slate'
      ? {
          backgroundImage:
            'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.03) 0%, rgba(0,0,0,0.3) 100%), linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
          backgroundColor: '#0f172a',
        }
      : {
          backgroundImage:
            'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.8) 0%, rgba(240,230,210,0.8) 100%), linear-gradient(135deg, #f7efe1 0%, #ebdcc4 100%)',
          backgroundColor: '#f7efe1',
        };

  const gridLineColor =
    theme === 'wood'
      ? 'bg-[#6b421a]/55'
      : theme === 'slate'
      ? 'bg-slate-600/70'
      : 'bg-[#967858]/60';

  const starPointColor =
    theme === 'wood'
      ? 'bg-[#502e11]'
      : theme === 'slate'
      ? 'bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.6)]'
      : 'bg-[#6b4c2b]';

  const coordTextColor =
    theme === 'wood'
      ? 'text-[#613612] font-semibold'
      : theme === 'slate'
      ? 'text-slate-400 font-medium'
      : 'text-[#7a5732] font-semibold';

  return (
    <div className="relative w-full max-w-[620px] select-none mx-auto">
      {/* Wooden Bezel Container */}
      <div
        id="caro-board"
        className={`rounded-2xl p-2 sm:p-3.5 border-4 transition-all duration-300 ${themeContainerClass}`}
        style={themeBoardBg}
      >
        {/* Top Letters Coordinates */}
        <div className="grid grid-cols-15 mb-0.5 px-3.5 sm:px-4.5">
          {colLetters.map((char) => (
            <div
              key={`top-col-${char}`}
              className={`text-center text-[9px] sm:text-[11px] font-mono tracking-tighter ${coordTextColor}`}
            >
              {char}
            </div>
          ))}
        </div>

        <div className="flex items-center">
          {/* Left Numbers Coordinates */}
          <div className="flex flex-col justify-around py-0.5 sm:py-1 pr-1 text-right w-3.5 sm:w-4.5 shrink-0">
            {rowNumbers.map((num) => (
              <span
                key={`left-row-${num}`}
                className={`text-[8px] sm:text-[10px] font-mono leading-none ${coordTextColor}`}
              >
                {num}
              </span>
            ))}
          </div>

          {/* 15x15 Playing Grid */}
          <div className="relative flex-1 aspect-square rounded-lg overflow-hidden border border-black/20 shadow-inner">
            <div className="grid grid-cols-15 grid-rows-15 w-full h-full">
              {board.map((rowArr, r) =>
                rowArr.map((cellValue, c) => {
                  const hasStar = isStarPoint(r, c);
                  const isWinning = isWinningCell(r, c);
                  const isLast = isLastCell(r, c);
                  const isHint = isHintCell(r, c);
                  const isHovered =
                    hoverPos?.row === r &&
                    hoverPos?.col === c &&
                    !cellValue &&
                    !disabled &&
                    !isBotThinking;
                  const cellNotation = toNotation(r, c);

                  return (
                    <button
                      key={`cell-${r}-${c}`}
                      id={`cell-${r}-${c}`}
                      type="button"
                      disabled={disabled || cellValue !== null || isBotThinking}
                      onClick={() => onCellClick(r, c)}
                      onMouseEnter={() => setHoverPos({ row: r, col: c })}
                      onMouseLeave={() => setHoverPos(null)}
                      title={`${cellNotation}${cellValue ? ` (${cellValue})` : ''}`}
                      className="relative w-full h-full p-0 m-0 border-0 flex items-center justify-center focus:outline-none cursor-pointer disabled:cursor-default group"
                    >
                      {/* Horizontal Grid Line */}
                      <div
                        className={`absolute top-1/2 left-0 right-0 h-[1px] -translate-y-1/2 ${gridLineColor} pointer-events-none ${
                          c === 0 ? 'left-1/2' : ''
                        } ${c === BOARD_SIZE - 1 ? 'right-1/2' : ''}`}
                      />

                      {/* Vertical Grid Line */}
                      <div
                        className={`absolute left-1/2 top-0 bottom-0 w-[1px] -translate-x-1/2 ${gridLineColor} pointer-events-none ${
                          r === 0 ? 'top-1/2' : ''
                        } ${r === BOARD_SIZE - 1 ? 'bottom-1/2' : ''}`}
                      />

                      {/* Hoshi Star Point */}
                      {hasStar && (
                        <div
                          className={`absolute w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 ${starPointColor} pointer-events-none shadow-xs`}
                        />
                      )}

                      {/* Strategic Hint Aura */}
                      {isHint && !cellValue && (
                        <div className="absolute inset-0.5 rounded-full border-2 border-amber-400 bg-amber-400/25 animate-ping pointer-events-none z-10" />
                      )}

                      {/* Placed Piece */}
                      {cellValue && (
                        <motion.div
                          initial={{ scale: 0.2, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ type: 'spring', stiffness: 520, damping: 26 }}
                          className={`relative z-10 w-[84%] h-[84%] rounded-full flex items-center justify-center shadow-md ${
                            cellValue === 'X'
                              ? 'bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-800 text-white shadow-blue-950/40'
                              : 'bg-gradient-to-br from-rose-500 via-red-600 to-rose-900 text-white shadow-red-950/40'
                          } ${
                            isWinning
                              ? 'ring-4 ring-amber-300 ring-offset-1 shadow-[0_0_18px_rgba(252,211,77,1)] animate-pulse z-20'
                              : ''
                          }`}
                        >
                          {/* Inner Reflection Glare */}
                          <div className="absolute top-1 left-1.5 w-1/3 h-1/4 rounded-full bg-white/40 blur-[0.6px] pointer-events-none" />

                          {/* Symbol: X or O */}
                          <span className="font-black select-none pointer-events-none text-xs sm:text-base drop-shadow-sm font-sans">
                            {cellValue}
                          </span>

                          {/* Last Move Indicator Beacon */}
                          {isLast && (
                            <div className="absolute -top-1 -right-1 w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-amber-400 ring-2 ring-white shadow-sm animate-bounce" />
                          )}
                        </motion.div>
                      )}

                      {/* Hover Preview Ghost */}
                      {isHovered && (
                        <div
                          className={`z-10 w-[78%] h-[78%] rounded-full border-2 border-dashed flex items-center justify-center pointer-events-none transition-all duration-150 ${
                            currentPlayer === 'X'
                              ? 'border-blue-500/80 bg-blue-500/20 text-blue-700'
                              : 'border-red-500/80 bg-red-500/20 text-red-700'
                          }`}
                        >
                          <span className="text-[10px] sm:text-xs font-bold opacity-80">
                            {currentPlayer}
                          </span>
                        </div>
                      )}
                    </button>
                  );
                })
              )}
            </div>

            {/* Bot Thinking Overlay Banner */}
            {isBotThinking && (
              <div className="absolute inset-0 bg-slate-950/30 backdrop-blur-[1px] flex items-center justify-center z-30 pointer-events-none">
                <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900/90 text-amber-300 border border-amber-500/40 shadow-xl text-xs font-bold animate-pulse">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                  <span>Máy đang tính toán nước đi...</span>
                </div>
              </div>
            )}
          </div>

          {/* Right Numbers Coordinates */}
          <div className="flex flex-col justify-around py-0.5 sm:py-1 pl-1 text-left w-3.5 sm:w-4.5 shrink-0">
            {rowNumbers.map((num) => (
              <span
                key={`right-row-${num}`}
                className={`text-[8px] sm:text-[10px] font-mono leading-none ${coordTextColor}`}
              >
                {num}
              </span>
            ))}
          </div>
        </div>

        {/* Bottom Letters Coordinates */}
        <div className="grid grid-cols-15 mt-0.5 px-3.5 sm:px-4.5">
          {colLetters.map((char) => (
            <div
              key={`bottom-col-${char}`}
              className={`text-center text-[9px] sm:text-[11px] font-mono tracking-tighter ${coordTextColor}`}
            >
              {char}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
