import { Player, CellValue, Position, WinResult, CaroRule } from '../types';

export const BOARD_SIZE = 15;

export const STAR_POINTS: Position[] = [
  { row: 3, col: 3 },   // D12
  { row: 3, col: 11 },  // L12
  { row: 7, col: 7 },   // H8 (Center)
  { row: 11, col: 3 },  // D4
  { row: 11, col: 11 }, // L4
];

export function isStarPoint(row: number, col: number): boolean {
  return STAR_POINTS.some((p) => p.row === row && p.col === col);
}

export function toNotation(row: number, col: number): string {
  const colLetter = String.fromCharCode(65 + col);
  const rowNumber = BOARD_SIZE - row;
  return `${colLetter}${rowNumber}`;
}

export function createEmptyBoard(): CellValue[][] {
  return Array.from({ length: BOARD_SIZE }, () =>
    Array.from({ length: BOARD_SIZE }, () => null)
  );
}

const DIRECTIONS: {
  dx: number;
  dy: number;
  direction: 'horizontal' | 'vertical' | 'diagonal-main' | 'diagonal-anti';
}[] = [
  { dx: 0, dy: 1, direction: 'horizontal' },
  { dx: 1, dy: 0, direction: 'vertical' },
  { dx: 1, dy: 1, direction: 'diagonal-main' },
  { dx: 1, dy: -1, direction: 'diagonal-anti' },
];

export function checkWinAtPosition(
  board: CellValue[][],
  row: number,
  col: number,
  rule: CaroRule
): WinResult | null {
  const player = board[row][col];
  if (!player) return null;

  const opponent: Player = player === 'X' ? 'O' : 'X';

  for (const { dx, dy, direction } of DIRECTIONS) {
    // Forward direction
    const forwardLine: Position[] = [];
    let r = row + dx;
    let c = col + dy;
    while (r >= 0 && r < BOARD_SIZE && c >= 0 && c < BOARD_SIZE && board[r][c] === player) {
      forwardLine.push({ row: r, col: c });
      r += dx;
      c += dy;
    }
    const endNeighborRow = r;
    const endNeighborCol = c;

    // Backward direction
    const backwardLine: Position[] = [];
    r = row - dx;
    c = col - dy;
    while (r >= 0 && r < BOARD_SIZE && c >= 0 && c < BOARD_SIZE && board[r][c] === player) {
      backwardLine.push({ row: r, col: c });
      r -= dx;
      c -= dy;
    }
    const startNeighborRow = r;
    const startNeighborCol = c;

    const fullLine: Position[] = [
      ...backwardLine.reverse(),
      { row, col },
      ...forwardLine,
    ];

    if (fullLine.length >= 5) {
      if (rule === 'blocked_ends') {
        const isStartBlocked =
          startNeighborRow >= 0 &&
          startNeighborRow < BOARD_SIZE &&
          startNeighborCol >= 0 &&
          startNeighborCol < BOARD_SIZE &&
          board[startNeighborRow][startNeighborCol] === opponent;

        const isEndBlocked =
          endNeighborRow >= 0 &&
          endNeighborRow < BOARD_SIZE &&
          endNeighborCol >= 0 &&
          endNeighborCol < BOARD_SIZE &&
          board[endNeighborRow][endNeighborCol] === opponent;

        // Vietnamese rule: Blocked at both ends is not a win
        if (isStartBlocked && isEndBlocked) {
          continue;
        }
      }

      return {
        winner: player,
        winningLine: fullLine.slice(0, 5),
        direction,
      };
    }
  }

  return null;
}

export function isBoardFull(board: CellValue[][]): boolean {
  for (let r = 0; r < BOARD_SIZE; r++) {
    for (let c = 0; c < BOARD_SIZE; c++) {
      if (board[r][c] === null) return false;
    }
  }
  return true;
}
