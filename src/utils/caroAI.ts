import { CellValue, Player, Position, CaroRule, Difficulty } from '../types';
import { BOARD_SIZE, checkWinAtPosition } from './caroLogic';

// Pattern Weights for heuristic evaluation
const SCORE = {
  WIN: 100_000_000,
  OPEN_FOUR: 10_000_000,
  BLOCKED_FOUR: 500_000,
  OPEN_THREE: 250_000,
  BLOCKED_THREE: 15_000,
  OPEN_TWO: 3_000,
  BLOCKED_TWO: 300,
};

const DIRECTIONS = [
  { dx: 0, dy: 1 },  // Horizontal
  { dx: 1, dy: 0 },  // Vertical
  { dx: 1, dy: 1 },  // Diagonal main
  { dx: 1, dy: -1 }, // Diagonal anti
];

// Evaluate line pattern centered at (r, c) for a given player
function evaluateDirection(
  board: CellValue[][],
  row: number,
  col: number,
  dx: number,
  dy: number,
  player: Player,
  rule: CaroRule
): number {
  const opponent: Player = player === 'X' ? 'O' : 'X';

  // Count consecutive player stones in forward direction
  let count = 1;
  let r = row + dx;
  let c = col + dy;
  while (r >= 0 && r < BOARD_SIZE && c >= 0 && c < BOARD_SIZE && board[r][c] === player) {
    count++;
    r += dx;
    c += dy;
  }
  const isEndBlocked =
    r < 0 || r >= BOARD_SIZE || c < 0 || c >= BOARD_SIZE || board[r][c] === opponent;
  const isEndEmpty =
    r >= 0 && r < BOARD_SIZE && c >= 0 && c < BOARD_SIZE && board[r][c] === null;

  // Count consecutive player stones in backward direction
  r = row - dx;
  c = col - dy;
  while (r >= 0 && r < BOARD_SIZE && c >= 0 && c < BOARD_SIZE && board[r][c] === player) {
    count++;
    r -= dx;
    c -= dy;
  }
  const isStartBlocked =
    r < 0 || r >= BOARD_SIZE || c < 0 || c >= BOARD_SIZE || board[r][c] === opponent;
  const isStartEmpty =
    r >= 0 && r < BOARD_SIZE && c >= 0 && c < BOARD_SIZE && board[r][c] === null;

  // 5 or more in a row
  if (count >= 5) {
    if (rule === 'blocked_ends' && isStartBlocked && isEndBlocked) {
      return 0; // Vietnamese rule: blocked at both ends doesn't win
    }
    return SCORE.WIN;
  }

  // 4 in a row
  if (count === 4) {
    if (isStartEmpty && isEndEmpty) {
      return SCORE.OPEN_FOUR;
    }
    if (isStartEmpty || isEndEmpty) {
      return SCORE.BLOCKED_FOUR;
    }
    return 0;
  }

  // 3 in a row
  if (count === 3) {
    if (isStartEmpty && isEndEmpty) {
      return SCORE.OPEN_THREE;
    }
    if (isStartEmpty || isEndEmpty) {
      return SCORE.BLOCKED_THREE;
    }
    return 0;
  }

  // 2 in a row
  if (count === 2) {
    if (isStartEmpty && isEndEmpty) {
      return SCORE.OPEN_TWO;
    }
    if (isStartEmpty || isEndEmpty) {
      return SCORE.BLOCKED_TWO;
    }
    return 0;
  }

  return 0;
}

// Calculate candidate score for placing `player` at (row, col)
function evaluateMove(
  board: CellValue[][],
  row: number,
  col: number,
  botPlayer: Player,
  rule: CaroRule
): { attackScore: number; defendScore: number; totalScore: number } {
  const humanPlayer: Player = botPlayer === 'X' ? 'O' : 'X';

  // 1. Attack evaluation (Bot places piece here)
  board[row][col] = botPlayer;
  let attackScore = 0;
  let botOpenThrees = 0;
  let botFours = 0;

  for (const { dx, dy } of DIRECTIONS) {
    const score = evaluateDirection(board, row, col, dx, dy, botPlayer, rule);
    attackScore += score;
    if (score === SCORE.OPEN_THREE) botOpenThrees++;
    if (score === SCORE.OPEN_FOUR || score === SCORE.BLOCKED_FOUR) botFours++;
  }

  // Double threat fork bonus (e.g. 3-3 or 4-3 combo)
  if (botOpenThrees >= 2 || (botFours >= 1 && botOpenThrees >= 1)) {
    attackScore += SCORE.OPEN_FOUR * 0.9;
  }

  // 2. Defense evaluation (If human placed piece here)
  board[row][col] = humanPlayer;
  let defendScore = 0;
  let humanOpenThrees = 0;
  let humanFours = 0;

  for (const { dx, dy } of DIRECTIONS) {
    const score = evaluateDirection(board, row, col, dx, dy, humanPlayer, rule);
    defendScore += score;
    if (score === SCORE.OPEN_THREE) humanOpenThrees++;
    if (score === SCORE.OPEN_FOUR || score === SCORE.BLOCKED_FOUR) humanFours++;
  }

  if (humanOpenThrees >= 2 || (humanFours >= 1 && humanOpenThrees >= 1)) {
    defendScore += SCORE.OPEN_FOUR * 0.85;
  }

  // Restore empty cell
  board[row][col] = null;

  // Center proximity bonus (center is 7, 7)
  const distFromCenter = Math.abs(row - 7) + Math.abs(col - 7);
  const positionBonus = (14 - distFromCenter) * 10;

  // Total balance: if human has a direct win or open 4, defense is paramount
  let totalScore = attackScore + defendScore * 1.15 + positionBonus;

  if (attackScore >= SCORE.WIN) {
    totalScore = SCORE.WIN * 2; // Immediate win has top priority
  } else if (defendScore >= SCORE.WIN) {
    totalScore = SCORE.WIN * 1.5; // Immediate block of win is critical
  }

  return { attackScore, defendScore, totalScore };
}

// Find candidate moves near existing stones (within radius of 2 cells)
function getCandidateMoves(board: CellValue[][]): Position[] {
  const candidates: Position[] = [];
  const visited = new Set<string>();

  let hasStones = false;

  for (let r = 0; r < BOARD_SIZE; r++) {
    for (let c = 0; c < BOARD_SIZE; c++) {
      if (board[r][c] !== null) {
        hasStones = true;
        // Check surrounding neighbors within distance 2
        for (let dr = -2; dr <= 2; dr++) {
          for (let dc = -2; dc <= 2; dc++) {
            const nr = r + dr;
            const nc = c + dc;
            if (nr >= 0 && nr < BOARD_SIZE && nc >= 0 && nc < BOARD_SIZE) {
              const key = `${nr},${nc}`;
              if (board[nr][nc] === null && !visited.has(key)) {
                visited.add(key);
                candidates.push({ row: nr, col: nc });
              }
            }
          }
        }
      }
    }
  }

  // If board is empty, start in the center (H8 = 7,7)
  if (!hasStones) {
    return [{ row: 7, col: 7 }];
  }

  return candidates;
}

export function findBestMove(
  board: CellValue[][],
  botPlayer: Player,
  difficulty: Difficulty,
  rule: CaroRule
): Position {
  const candidates = getCandidateMoves(board);
  if (candidates.length === 0) return { row: 7, col: 7 };

  // Score all candidate moves
  const scoredMoves: { pos: Position; score: number }[] = candidates.map((pos) => {
    const { totalScore } = evaluateMove(board, pos.row, pos.col, botPlayer, rule);
    return { pos, score: totalScore };
  });

  // Sort descending by score
  scoredMoves.sort((a, b) => b.score - a.score);

  // Difficulty adjustment:
  if (difficulty === 'easy') {
    // Top moves might be skipped 40% of the time, picking from top 5 randomly
    if (scoredMoves.length > 1 && Math.random() < 0.45) {
      const pickRange = Math.min(5, scoredMoves.length);
      const randomIdx = Math.floor(Math.random() * pickRange);
      return scoredMoves[randomIdx].pos;
    }
    return scoredMoves[0].pos;
  }

  if (difficulty === 'medium') {
    // Occasionally picks the 2nd best move if scores are close
    if (
      scoredMoves.length > 2 &&
      scoredMoves[0].score < SCORE.BLOCKED_FOUR &&
      Math.random() < 0.2
    ) {
      return scoredMoves[1].pos;
    }
    return scoredMoves[0].pos;
  }

  // Hard (Master): Always select the highest scoring move
  // If multiple top moves have identical scores, randomly pick between them to avoid repetitive games
  const topScore = scoredMoves[0].score;
  const bestTies = scoredMoves.filter((m) => m.score >= topScore - 50);
  const chosen = bestTies[Math.floor(Math.random() * bestTies.length)];
  return chosen.pos;
}

// Hint system for the player
export function getPlayerHint(
  board: CellValue[][],
  player: Player,
  rule: CaroRule
): Position | null {
  const candidates = getCandidateMoves(board);
  if (candidates.length === 0) return { row: 7, col: 7 };

  let bestMove: Position = candidates[0];
  let bestScore = -Infinity;

  for (const pos of candidates) {
    const { totalScore } = evaluateMove(board, pos.row, pos.col, player, rule);
    if (totalScore > bestScore) {
      bestScore = totalScore;
      bestMove = pos;
    }
  }

  return bestMove;
}
