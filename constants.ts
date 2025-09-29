import { Coordinate, Direction } from './types';

export const BOARD_SIZE: number = 20;
export const GAME_SPEED_MS: number = 150;

export const INITIAL_SNAKE_POSITION: Coordinate[] = [
  { x: Math.floor(BOARD_SIZE / 2), y: Math.floor(BOARD_SIZE / 2) },
  { x: Math.floor(BOARD_SIZE / 2) - 1, y: Math.floor(BOARD_SIZE / 2) },
];

export const INITIAL_DIRECTION: Direction = Direction.RIGHT;
