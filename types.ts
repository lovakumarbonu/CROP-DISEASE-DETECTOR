export type Coordinate = {
  x: number;
  y: number;
};

export enum Direction {
  UP,
  DOWN,
  LEFT,
  RIGHT,
}

export type GameState = 'IDLE' | 'RUNNING' | 'GAME_OVER';
