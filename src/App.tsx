/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { CaroBoard } from './components/CaroBoard';
import { ScoreCard } from './components/ScoreCard';
import { ControlToolbar } from './components/ControlToolbar';
import { MoveHistoryDrawer } from './components/MoveHistoryDrawer';
import { GameOverModal } from './components/GameOverModal';
import { SettingsModal } from './components/SettingsModal';
import { GameNavbar } from './components/GameNavbar';
import {
  CellValue,
  Player,
  Position,
  WinResult,
  GameMode,
  Difficulty,
  CaroRule,
  BoardTheme,
  Move,
  GameStats,
} from './types';
import {
  createEmptyBoard,
  checkWinAtPosition,
  isBoardFull,
  toNotation,
} from './utils/caroLogic';
import { findBestMove, getPlayerHint } from './utils/caroAI';
import { soundManager } from './utils/audio';

export default function App() {
  // Game Board State
  const [board, setBoard] = useState<CellValue[][]>(createEmptyBoard);
  const [currentPlayer, setCurrentPlayer] = useState<Player>('X');
  const [startingPlayer, setStartingPlayer] = useState<Player>('X');
  const [winResult, setWinResult] = useState<WinResult | null>(null);
  const [isDraw, setIsDraw] = useState<boolean>(false);
  const [moves, setMoves] = useState<Move[]>([]);
  const [undoneMoves, setUndoneMoves] = useState<Move[]>([]);
  const [lastMove, setLastMove] = useState<Position | null>(null);

  // Bot & Interactive State
  const [isBotThinking, setIsBotThinking] = useState<boolean>(false);
  const [hintPos, setHintPos] = useState<Position | null>(null);
  const [hoverPos, setHoverPos] = useState<Position | null>(null);

  // Settings & Configuration
  const [gameMode, setGameMode] = useState<GameMode>(() => {
    return (localStorage.getItem('caro_mode') as GameMode) || 'pve';
  });

  const [difficulty, setDifficulty] = useState<Difficulty>(() => {
    return (localStorage.getItem('caro_diff') as Difficulty) || 'medium';
  });

  const [playerSide, setPlayerSide] = useState<Player>(() => {
    return (localStorage.getItem('caro_side') as Player) || 'X';
  });

  const [rule, setRule] = useState<CaroRule>(() => {
    return (localStorage.getItem('caro_rule') as CaroRule) || 'blocked_ends';
  });

  const [theme, setTheme] = useState<BoardTheme>(() => {
    return (localStorage.getItem('caro_theme') as BoardTheme) || 'wood';
  });

  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => {
    const saved = localStorage.getItem('caro_sound');
    return saved !== null ? saved === 'true' : true;
  });

  // Player Names
  const [player1Name, setPlayer1Name] = useState<string>(() => {
    return localStorage.getItem('caro_p1_name') || 'Bạn';
  });

  const [player2Name, setPlayer2Name] = useState<string>(() => {
    return localStorage.getItem('caro_p2_name') || 'Người chơi 2';
  });

  // Statistics
  const [stats, setStats] = useState<GameStats>(() => {
    try {
      const saved = localStorage.getItem('caro_stats');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return {
      pvePlayerWins: 0,
      pveBotWins: 0,
      pvpXWins: 0,
      pvpOWins: 0,
      draws: 0,
      streak: 0,
    };
  });

  // Modals
  const [isGameOverModalOpen, setIsGameOverModalOpen] = useState<boolean>(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState<boolean>(false);

  const botTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Sync sound manager
  useEffect(() => {
    soundManager.enabled = soundEnabled;
    localStorage.setItem('caro_sound', String(soundEnabled));
  }, [soundEnabled]);

  // Persist configurations
  useEffect(() => {
    localStorage.setItem('caro_mode', gameMode);
  }, [gameMode]);

  useEffect(() => {
    localStorage.setItem('caro_diff', difficulty);
  }, [difficulty]);

  useEffect(() => {
    localStorage.setItem('caro_side', playerSide);
  }, [playerSide]);

  useEffect(() => {
    localStorage.setItem('caro_rule', rule);
  }, [rule]);

  useEffect(() => {
    localStorage.setItem('caro_theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('caro_stats', JSON.stringify(stats));
  }, [stats]);

  const handleUpdatePlayerName = (player: Player, name: string) => {
    const trimmed = name.trim() || (player === 'X' ? 'Người chơi 1' : 'Người chơi 2');
    if (player === 'X') {
      setPlayer1Name(trimmed);
      localStorage.setItem('caro_p1_name', trimmed);
    } else {
      setPlayer2Name(trimmed);
      localStorage.setItem('caro_p2_name', trimmed);
    }
  };

  // Rebuild board helper
  const rebuildBoard = (moveList: Move[]): CellValue[][] => {
    const newBoard = createEmptyBoard();
    moveList.forEach((m) => {
      newBoard[m.row][m.col] = m.player;
    });
    return newBoard;
  };

  // Handle Player Move
  const handleCellClick = (row: number, col: number) => {
    if (board[row][col] !== null || winResult !== null || isDraw || isBotThinking) {
      return;
    }

    // In PvE, player can only move when it's their turn
    if (gameMode === 'pve' && currentPlayer !== playerSide) {
      return;
    }

    // Clear hint
    setHintPos(null);

    const player = currentPlayer;
    const notation = toNotation(row, col);

    soundManager.playMove(player === 'X', false);

    const newBoard = board.map((r, rIdx) =>
      r.map((c, cIdx) => (rIdx === row && cIdx === col ? player : c))
    );

    const newMove: Move = {
      index: moves.length + 1,
      player,
      row,
      col,
      notation,
      timestamp: Date.now(),
    };

    const newMoves = [...moves, newMove];
    setBoard(newBoard);
    setMoves(newMoves);
    setLastMove({ row, col });
    setUndoneMoves([]);

    // Check for win
    const win = checkWinAtPosition(newBoard, row, col, rule);
    if (win) {
      setWinResult(win);
      soundManager.playWin();
      if (gameMode === 'pve') {
        setStats((prev) => ({
          ...prev,
          pvePlayerWins: prev.pvePlayerWins + 1,
          streak: prev.streak + 1,
        }));
      } else {
        setStats((prev) => ({
          ...prev,
          pvpXWins: win.winner === 'X' ? prev.pvpXWins + 1 : prev.pvpXWins,
          pvpOWins: win.winner === 'O' ? prev.pvpOWins + 1 : prev.pvpOWins,
        }));
      }
      setIsGameOverModalOpen(true);
      return;
    }

    // Check for draw
    if (isBoardFull(newBoard)) {
      setIsDraw(true);
      setStats((prev) => ({ ...prev, draws: prev.draws + 1, streak: 0 }));
      setIsGameOverModalOpen(true);
      return;
    }

    // Switch turn
    setCurrentPlayer(player === 'X' ? 'O' : 'X');
  };

  // Automated AI Bot Turn
  useEffect(() => {
    if (gameMode !== 'pve' || winResult !== null || isDraw) {
      return;
    }

    const botPlayer: Player = playerSide === 'X' ? 'O' : 'X';

    // If it's the bot's turn
    if (currentPlayer === botPlayer) {
      setIsBotThinking(true);

      // Realistic thinking delay between 350ms - 550ms
      const delay = Math.floor(Math.random() * 200) + 380;

      botTimeoutRef.current = setTimeout(() => {
        // Calculate best move using heuristic evaluator
        const botMove = findBestMove(board, botPlayer, difficulty, rule);

        soundManager.playMove(botPlayer === 'X', true);

        const newBoard = board.map((r, rIdx) =>
          r.map((c, cIdx) => (rIdx === botMove.row && cIdx === botMove.col ? botPlayer : c))
        );

        const newMove: Move = {
          index: moves.length + 1,
          player: botPlayer,
          row: botMove.row,
          col: botMove.col,
          notation: toNotation(botMove.row, botMove.col),
          timestamp: Date.now(),
        };

        const newMoves = [...moves, newMove];
        setBoard(newBoard);
        setMoves(newMoves);
        setLastMove(botMove);
        setIsBotThinking(false);

        // Check if Bot won
        const win = checkWinAtPosition(newBoard, botMove.row, botMove.col, rule);
        if (win) {
          setWinResult(win);
          soundManager.playLoss();
          setStats((prev) => ({
            ...prev,
            pveBotWins: prev.pveBotWins + 1,
            streak: 0,
          }));
          setIsGameOverModalOpen(true);
          return;
        }

        // Check draw
        if (isBoardFull(newBoard)) {
          setIsDraw(true);
          setStats((prev) => ({ ...prev, draws: prev.draws + 1, streak: 0 }));
          setIsGameOverModalOpen(true);
          return;
        }

        // Hand turn back to player
        setCurrentPlayer(playerSide);
      }, delay);
    }

    return () => {
      if (botTimeoutRef.current) {
        clearTimeout(botTimeoutRef.current);
      }
    };
  }, [currentPlayer, gameMode, playerSide, winResult, isDraw, board, moves, difficulty, rule]);

  // Undo Move
  const handleUndo = useCallback(() => {
    if (moves.length === 0 || isBotThinking) return;

    if (botTimeoutRef.current) {
      clearTimeout(botTimeoutRef.current);
      setIsBotThinking(false);
    }

    // In PvE, undo 2 moves (Bot move + Player move) so player gets their turn back
    let movesToUndo = 1;
    if (gameMode === 'pve') {
      const last = moves[moves.length - 1];
      if (last.player !== playerSide && moves.length >= 2) {
        movesToUndo = 2;
      }
    }

    const poppedMoves = moves.slice(-movesToUndo);
    const remainingMoves = moves.slice(0, moves.length - movesToUndo);
    const newBoard = rebuildBoard(remainingMoves);

    soundManager.playUndo();
    setBoard(newBoard);
    setMoves(remainingMoves);
    setUndoneMoves([...poppedMoves, ...undoneMoves]);
    setWinResult(null);
    setIsDraw(false);
    setIsGameOverModalOpen(false);
    setHintPos(null);

    if (remainingMoves.length > 0) {
      const prev = remainingMoves[remainingMoves.length - 1];
      setLastMove({ row: prev.row, col: prev.col });
      setCurrentPlayer(prev.player === 'X' ? 'O' : 'X');
    } else {
      setLastMove(null);
      setCurrentPlayer(startingPlayer);
    }
  }, [moves, isBotThinking, gameMode, playerSide, undoneMoves, startingPlayer]);

  // Redo Move
  const handleRedo = useCallback(() => {
    if (undoneMoves.length === 0 || isBotThinking) return;

    // Redo 1 or 2 moves depending on mode
    let movesToRedo = 1;
    if (gameMode === 'pve' && undoneMoves.length >= 2) {
      movesToRedo = 2;
    }

    const redone = undoneMoves.slice(0, movesToRedo);
    const remainingUndone = undoneMoves.slice(movesToRedo);
    const newMoves = [...moves, ...redone];
    const newBoard = rebuildBoard(newMoves);

    const last = redone[redone.length - 1];
    soundManager.playMove(last.player === 'X');

    setBoard(newBoard);
    setMoves(newMoves);
    setUndoneMoves(remainingUndone);
    setLastMove({ row: last.row, col: last.col });
    setCurrentPlayer(last.player === 'X' ? 'O' : 'X');

    // Check win on the latest redone position
    const win = checkWinAtPosition(newBoard, last.row, last.col, rule);
    if (win) {
      setWinResult(win);
      setIsGameOverModalOpen(true);
    }
  }, [undoneMoves, isBotThinking, gameMode, moves, rule]);

  // Hint
  const handleGetHint = () => {
    if (winResult !== null || isDraw || isBotThinking) return;
    const targetPlayer = gameMode === 'pve' ? playerSide : currentPlayer;
    const hint = getPlayerHint(board, targetPlayer, rule);
    if (hint) {
      soundManager.playHint();
      setHintPos(hint);
      // Auto clear hint aura after 3 seconds
      setTimeout(() => setHintPos(null), 3000);
    }
  };

  // Start New Game
  const handleNewGame = () => {
    if (botTimeoutRef.current) {
      clearTimeout(botTimeoutRef.current);
      setIsBotThinking(false);
    }

    // In PvE, if player is X, X always starts; if player is O, Bot is X and starts
    const nextStarter: Player = 'X';
    setStartingPlayer(nextStarter);
    setCurrentPlayer(nextStarter);
    setBoard(createEmptyBoard());
    setMoves([]);
    setUndoneMoves([]);
    setWinResult(null);
    setIsDraw(false);
    setLastMove(null);
    setHintPos(null);
    setHoverPos(null);
    setIsGameOverModalOpen(false);
  };

  // Reset stats
  const handleResetStats = () => {
    if (window.confirm('Bạn có chắc chắn muốn đặt lại toàn bộ thống kê thắng/thua về 0?')) {
      setStats({
        pvePlayerWins: 0,
        pveBotWins: 0,
        pvpXWins: 0,
        pvpOWins: 0,
        draws: 0,
        streak: 0,
      });
      setIsSettingsModalOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between font-sans selection:bg-amber-500/30 selection:text-amber-200">
      {/* Top Navbar */}
      <GameNavbar
        gameMode={gameMode}
        difficulty={difficulty}
        onNewGame={handleNewGame}
        onOpenSettings={() => setIsSettingsModalOpen(true)}
        soundEnabled={soundEnabled}
        onToggleSound={() => setSoundEnabled(!soundEnabled)}
      />

      {/* Main Playing Arena */}
      <main className="flex-1 w-full max-w-4xl mx-auto px-2 sm:px-4 py-3 sm:py-6 flex flex-col items-center justify-center">
        {/* Score & Turn Indicator Card */}
        <ScoreCard
          gameMode={gameMode}
          difficulty={difficulty}
          currentPlayer={currentPlayer}
          playerSide={playerSide}
          stats={stats}
          isBotThinking={isBotThinking}
          player1Name={player1Name}
          player2Name={player2Name}
          onUpdatePlayerName={handleUpdatePlayerName}
          winner={winResult ? winResult.winner : isDraw ? 'draw' : null}
          moveCount={moves.length}
        />

        {/* 15x15 Caro Board */}
        <CaroBoard
          board={board}
          currentPlayer={currentPlayer}
          onCellClick={handleCellClick}
          winResult={winResult}
          lastMove={lastMove}
          hintPos={hintPos}
          hoverPos={hoverPos}
          setHoverPos={setHoverPos}
          disabled={winResult !== null || isDraw}
          theme={theme}
          isBotThinking={isBotThinking}
        />

        {/* Action Controls & Mode Switchers */}
        <ControlToolbar
          gameMode={gameMode}
          onSetGameMode={(m) => {
            setGameMode(m);
            handleNewGame();
          }}
          difficulty={difficulty}
          onSetDifficulty={(d) => {
            setDifficulty(d);
            handleNewGame();
          }}
          playerSide={playerSide}
          onSetPlayerSide={(s) => {
            setPlayerSide(s);
            handleNewGame();
          }}
          onNewGame={handleNewGame}
          onUndo={handleUndo}
          onRedo={handleRedo}
          onGetHint={handleGetHint}
          canUndo={moves.length > 0}
          canRedo={undoneMoves.length > 0}
          isBotThinking={isBotThinking}
          soundEnabled={soundEnabled}
          onToggleSound={() => setSoundEnabled(!soundEnabled)}
          onOpenSettings={() => setIsSettingsModalOpen(true)}
          rule={rule}
        />

        {/* Move History Drawer */}
        <MoveHistoryDrawer moves={moves} />
      </main>

      {/* Footer */}
      <footer className="w-full max-w-4xl mx-auto text-center py-3 text-[11px] text-slate-500 border-t border-slate-900 px-4">
        Cờ Ca Rô 15x15 &middot; Đấu với Máy Tự Động &middot; Hỗ trợ Luật Chặn 2 Đầu và Chuỗi Thắng
      </footer>

      {/* Modals */}
      <GameOverModal
        winner={winResult ? winResult.winner : isDraw ? 'draw' : null}
        isOpen={isGameOverModalOpen}
        gameMode={gameMode}
        playerSide={playerSide}
        player1Name={player1Name}
        player2Name={player2Name}
        moveCount={moves.length}
        onNewGame={handleNewGame}
        onClose={() => setIsGameOverModalOpen(false)}
      />

      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        theme={theme}
        onSetTheme={setTheme}
        rule={rule}
        onSetRule={setRule}
        onResetStats={handleResetStats}
      />
    </div>
  );
}
