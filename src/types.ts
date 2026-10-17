export type Player = 'X' | 'O';

export type CellValue = Player | null;

export interface Position {
  row: number; // 0 to 14
  col: number; // 0 to 14
}

export type GameMode = 'pve' | 'pvp'; // pve: Người vs Máy, pvp: 2 Người

export type Difficulty = 'easy' | 'medium' | 'hard';

export type CaroRule = 'standard' | 'blocked_ends'; // 'standard' (5 liên tiếp thắng) | 'blocked_ends' (luật VN chặn 2 đầu)

export type BoardTheme = 'wood' | 'slate' | 'parchment';

export interface Move {
  index: number;
  player: Player;
  row: number;
  col: number;
  notation: string; // e.g. "H8"
  timestamp: number;
}

export interface WinResult {
  winner: Player;
  winningLine: Position[];
  direction: 'horizontal' | 'vertical' | 'diagonal-main' | 'diagonal-anti';
}

export interface GameStats {
  pvePlayerWins: number;
  pveBotWins: number;
  pvpXWins: number;
  pvpOWins: number;
  draws: number;
  streak: number;
}
