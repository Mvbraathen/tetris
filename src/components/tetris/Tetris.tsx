import React, { useEffect, useState } from 'react';
import Swipe, { SwipePosition } from 'react-easy-swipe';
// eslint-disable-next-line
import useSound from 'use-sound';

import { ReactComponent as ComputasLogo } from '../../svg/computas.svg';
import { ReactComponent as TetrisVertical } from '../../svg/tetrisVertical.svg';
import css from './Tetris.module.scss';
import Display from 'components/display/Display';
import GameOver from '../gameover/GameOver';
import StartScreen from '../startscreen/StartScreen';
import Next from 'components/next/Next';
import Stage from 'components/stage/Stage';
import {
  calculateLandingRow,
  canMove,
  createStage,
  detectCollision
} from 'helpers';
import {
  useController,
  useGameStatus,
  useInterval,
  usePlayer,
  useStage
} from 'hooks';

export interface GameState {
  gameOver: boolean;
  startScreen: boolean;
  dropSpeed: number;
}

const initialGameState: GameState = {
  gameOver: false,
  startScreen: true,
  dropSpeed: 1100
};

const LEFT = -1;
const RIGHT = 1;
const BLOCK_SIZE = 32;
const SPEED_FACTOR = 450;
const LEVEL_FACTOR = 125;

export default function Tetris() {
  const [state, setState] = useState(initialGameState);
  const [touchStartPosition, setTouchStartPosition] = useState({
    x: 0,
    y: 0,
    timeStamp: 0
  });
  const [touchPosition, setTouchPosition] = useState({ x: 0, y: 0 });
  const [player, updatePlayerPosition, rotatePlayer, applyNextTetromino] =
    usePlayer();
  const [stage, setStage, rowsCleared] = useStage(player);
  const [score, rows, level, tetrominos, resetGame, generateNextTetromino] =
    useGameStatus(rowsCleared);
  const [dropSpeed, setDropSpeed] = useState(1100);
  const [gamesPlayed, setGamesPlayed] = useState(0);
  const [
    leftPressState,
    rightPressState,
    downPressState,
    rotatePressState,
    handleKeyPressed,
    handleKeyReleased
  ] = useController();

  const [playMoveBlockSound] = useSound('/assets/sfx/suction-plop1.mp3');
  const [playDropDownSound] = useSound('/assets/sfx/drop1.mp3');
  const [playHitFloorSound] = useSound('/assets/sfx/hit-floor.mp3');
  const [playHitWallSound] = useSound('/assets/sfx/hit-wall.mp3');
  const [playRotateSound] = useSound('/assets/sfx/rotate.mp3', {
    volume: 0.4
  });
  const [playRemoveLine] = useSound('/assets/sfx/remove1.mp3');
  const [playYouLose] = useSound('/assets/sfx/you-lose.mp3');

  const levelSpeed = (): number => {
    return SPEED_FACTOR / level + LEVEL_FACTOR;
  };

  useEffect(() => {
    document.querySelector('section')?.focus();
  }, []);

  useEffect(() => {
    if (downPressState) {
      if (state.gameOver || state.startScreen) {
        play();
        return;
      }

      moveMaxDown();
    }
  }, [downPressState]);

  useEffect(() => {
    if (rotatePressState) {
      playRotateSound();
      rotatePlayer(stage, 1);
    }
  }, [rotatePressState]);

  useEffect(() => {
    if (leftPressState) {
      movePlayer(LEFT);
    }
    if (rightPressState) {
      movePlayer(RIGHT);
    }
  }, [leftPressState, rightPressState]);

  useEffect(() => {
    if (player.collided) {
      if (player.position.y < 0) {
        setState({
          ...state,
          gameOver: true,
          startScreen: false
        });
        playYouLose();
        return;
      } else {
        playHitFloorSound();
        generateNextTetromino();
      }
    }
  }, [player.collided]);

  useEffect(() => {
    if (player.position.y + player.tetromino.shape.length - 1 > 0) {
      playMoveBlockSound();
    }
  }, [player.position.x]);

  useEffect(() => {
    applyNextTetromino(tetrominos[0]);
  }, [tetrominos]);

  useEffect(() => {
    setDropSpeed(levelSpeed);
  }, [level]);

  useEffect(() => {
    if (rowsCleared > 0) {
      playRemoveLine();
    }
  }, [rowsCleared]);

  useInterval(() => {
    if (!state.gameOver || !player.collided) {
      drop();
    }
  }, dropSpeed);

  useInterval(() => {
    if (!state.gameOver) {
      if (leftPressState) {
        movePlayer(LEFT);
      }
      if (rightPressState) {
        movePlayer(RIGHT);
      }
    }
  }, 130);

  const movePlayer = (dir: number): void => {
    if (state.gameOver) {
      return;
    }

    if (
      !canMove(player, {
        ...player.position,
        x: player.position.x + dir
      })
    ) {
      playHitWallSound();
      return;
    }

    if (
      detectCollision(player, stage, {
        ...player.position,
        x: player.position.x + dir
      })
    ) {
      return;
    }

    updatePlayerPosition(player.position.x + dir, player.position.y, false);
  };

  const moveMaxDown = (): void => {
    const row = calculateLandingRow(player, stage);
    updatePlayerPosition(player.position.x, row, true);
    playDropDownSound();
  };

  const drop = (): void => {
    if (state.gameOver || state.startScreen) {
      return;
    }

    const didCollide = detectCollision(player, stage, {
      ...player.position,
      y: player.position.y + 1
    });

    updatePlayerPosition(
      player.position.x,
      player.position.y + (didCollide ? 0 : 1),
      didCollide
    );
  };

  const play = (): void => {
    generateNextTetromino();
    resetGame();
    setStage(createStage());
    setState({
      ...state,
      gameOver: false,
      startScreen: false
    });
    setGamesPlayed(gamesPlayed + 1);

    document.querySelector('section')?.focus();
  };

  const returnHome = (): void => {
    setState({
      ...state,
      gameOver: false,
      startScreen: true
    });
    resetGame();
    setStage(createStage());
    setGamesPlayed(0);
  };

  const swipedDown = (): void => {
    moveMaxDown();
  };

  const swipeStart = (event: any): void => {
    if (state.gameOver || state.startScreen) {
      return;
    }

    const touch = event.changedTouches[0];
    setTouchPosition({ x: 0, y: 0 });
    setTouchStartPosition({
      x: touch.clientX,
      y: touch.clientY,
      timeStamp: event.timeStamp
    });
  };

  const swipeMove = (position: SwipePosition): void => {
    if (state.gameOver || state.startScreen) {
      return;
    }

    const delta = {
      x: touchPosition.x - position.x,
      y: touchPosition.y - position.y
    };

    if (Math.abs(delta.x) > BLOCK_SIZE) {
      setTouchPosition({ ...position });
      if (position.x > touchPosition.x) {
        movePlayer(RIGHT);
      }
      if (position.x < touchPosition.x) {
        movePlayer(LEFT);
      }
    }
  };

  const swipeEnd = (event: any): void => {
    if (state.gameOver || state.startScreen) {
      return;
    }

    const touch = event.changedTouches[0];
    const delta = {
      x: touch.clientX - touchStartPosition.x,
      y: touch.clientY - touchStartPosition.y,
      timeStamp: event.timeStamp - touchStartPosition.timeStamp,
      velocity:
        (touch.clientY - touchStartPosition.y) /
        (event.timeStamp - touchStartPosition.timeStamp + 1)
    };

    if (delta.velocity < 0.001 && delta.timeStamp < 200) {
      playRotateSound();
      rotatePlayer(stage, 1);
      return;
    }

    if (delta.velocity < 0.25) {
      return;
    }

    swipedDown();
  };

  return (
    <>
      <div className={css.alignTop}>
        <div>
          <Display
            content={'Rader: ' + rows}
            style={{ backgroundColor: '#29cff5' }}
          />
          <Display
            content={'Nivå: ' + level}
            style={{ backgroundColor: '#49bca1' }}
          />
        </div>
        <ComputasLogo className={css.ComputasLogo} />
        <div>
          <Display
            content={'Hastighet: ' + levelSpeed()}
            style={{ backgroundColor: '#ff5f63' }}
          />
          <Display
            content={'Poeng: ' + score}
            style={{ backgroundColor: '#fed546' }}
          />
        </div>
      </div>
      <Swipe
        onSwipeStart={swipeStart}
        onSwipeMove={swipeMove}
        onSwipeEnd={swipeEnd}
      >
        <section
          className={css.Tetris}
          onKeyDown={(event) => handleKeyPressed(event, state)}
          onKeyUp={(event) => handleKeyReleased(event, state)}
          tabIndex={0}
          onContextMenu={(event) => {
            event.stopPropagation();
            event.preventDefault();
          }}
        >
          <section>
            <Stage stage={stage} />
            <GameOver gameOver={state.gameOver && gamesPlayed > 0} />
            <StartScreen startScreen={state.startScreen && gamesPlayed === 0} />
            <Next tetromino={tetrominos[1]} />
            <aside>
              <TetrisVertical className={css.VerticalTetrisLogo} />
              {state.gameOver ? (
                <div className={css.buttonPlacement}>
                  <button
                    className={css.PlayAgainButton}
                    onClick={play}
                    tabIndex={-1}
                  >
                    Spill igjen
                  </button>
                  <button
                    className={css.HomeButton}
                    onClick={returnHome}
                    tabIndex={-1}
                  >
                    Hjem
                  </button>
                </div>
              ) : state.startScreen ? (
                <button className={css.PlayButton} onClick={play} tabIndex={-1}>
                  Spill
                </button>
              ) : null}
            </aside>
          </section>
        </section>
      </Swipe>
    </>
  );
}
