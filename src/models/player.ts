import { Tetromino } from '../helpers';
import { Position } from './position';

export interface Player {
  position: Position;
  tetromino: Tetromino;
  collided: boolean;
}
