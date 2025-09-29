import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Coordinate, Direction, GameState } from './types';
import { BOARD_SIZE, GAME_SPEED_MS, INITIAL_SNAKE_POSITION, INITIAL_DIRECTION } from './constants';
import SnakeLoader from './SnakeLoader';
import Controls from './Controls';

const generateFood = (snakeBody: Coordinate[]): Coordinate => {
  while (true) {
    const foodPosition = {
      x: Math.floor(Math.random() * BOARD_SIZE),
      y: Math.floor(Math.random() * BOARD_SIZE),
    };

    const isFoodOnSnake = snakeBody.some(
      segment => segment.x === foodPosition.x && segment.y === foodPosition.y
    );

    if (!isFoodOnSnake) {
      return foodPosition;
    }
  }
};

const App: React.FC = () => {
  const [snake, setSnake] = useState<Coordinate[]>(INITIAL_SNAKE_POSITION);
  const [food, setFood] = useState<Coordinate>(generateFood(INITIAL_SNAKE_POSITION));
  const [direction, setDirection] = useState<Direction>(INITIAL_DIRECTION);
  const [gameState, setGameState] = useState<GameState>('IDLE');
  const [score, setScore] = useState<number>(0);
  const [highScore, setHighScore] = useState<number>(() => {
      const savedHighScore = localStorage.getItem('snakeHighScore');
      return savedHighScore ? parseInt(savedHighScore, 10) : 0;
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const gameLoopRef = useRef<number | null>(null);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  const handleStartGame = () => {
    setGameState('RUNNING');
  };

  const handleResetGame = () => {
    if (score > highScore) {
        setHighScore(score);
        localStorage.setItem('snakeHighScore', score.toString());
    }
    setSnake(INITIAL_SNAKE_POSITION);
    setFood(generateFood(INITIAL_SNAKE_POSITION));
    setDirection(INITIAL_DIRECTION);
    setScore(0);
    setGameState('IDLE');
  };
  
  const changeDirection = useCallback((newDirection: Direction) => {
    setDirection(prevDirection => {
      const isOpposite =
        (newDirection === Direction.UP && prevDirection === Direction.DOWN) ||
        (newDirection === Direction.DOWN && prevDirection === Direction.UP) ||
        (newDirection === Direction.LEFT && prevDirection === Direction.RIGHT) ||
        (newDirection === Direction.RIGHT && prevDirection === Direction.LEFT);

      if (isOpposite) {
        return prevDirection;
      }
      return newDirection;
    });
  }, []);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowUp':
      case 'w':
        changeDirection(Direction.UP);
        break;
      case 'ArrowDown':
      case 's':
        changeDirection(Direction.DOWN);
        break;
      case 'ArrowLeft':
      case 'a':
        changeDirection(Direction.LEFT);
        break;
      case 'ArrowRight':
      case 'd':
        changeDirection(Direction.RIGHT);
        break;
    }
  }, [changeDirection]);

  const gameTick = useCallback(() => {
    setSnake(prevSnake => {
      const newSnake = [...prevSnake];
      const head = { ...newSnake[0] };

      switch (direction) {
        case Direction.UP:
          head.y -= 1;
          break;
        case Direction.DOWN:
          head.y += 1;
          break;
        case Direction.LEFT:
          head.x -= 1;
          break;
        case Direction.RIGHT:
          head.x += 1;
          break;
      }
      
      if (head.x < 0 || head.x >= BOARD_SIZE || head.y < 0 || head.y >= BOARD_SIZE) {
        setGameState('GAME_OVER');
        return prevSnake;
      }

      for (let i = 1; i < newSnake.length; i++) {
        if (head.x === newSnake[i].x && head.y === newSnake[i].y) {
          setGameState('GAME_OVER');
          return prevSnake;
        }
      }

      newSnake.unshift(head);

      if (head.x === food.x && head.y === food.y) {
        setScore(prevScore => prevScore + 1);
        setFood(generateFood(newSnake));
      } else {
        newSnake.pop();
      }
      
      return newSnake;
    });
  }, [direction, food]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  useEffect(() => {
    if (gameState === 'RUNNING') {
      gameLoopRef.current = setInterval(gameTick, GAME_SPEED_MS);
    } else {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
      }
    }
    return () => {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
      }
    };
  }, [gameState, gameTick]);

  const getCellClass = (x: number, y: number): string => {
    const isSnakeHead = snake[0].x === x && snake[0].y === y;
    const isSnakeBody = snake.slice(1).some(segment => segment.x === x && segment.y === y);
    const isFood = food.x === x && food.y === y;

    if (isSnakeHead) return 'bg-green-300 shadow-lg shadow-green-300/50 rounded-md';
    if (isSnakeBody) return 'bg-green-500 rounded-sm';
    if (isFood) return 'bg-red-500 shadow-lg shadow-red-500/50 rounded-full';
    return 'bg-gray-800';
  };

  const GameOverlay: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <div className="absolute inset-0 bg-black bg-opacity-70 flex flex-col justify-center items-center text-white z-10">
      {children}
    </div>
  );

  if (isLoading) {
    return <SnakeLoader />;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center font-mono p-4">
      <h1 className="text-4xl md:text-5xl font-bold text-green-400 mb-4 tracking-wider">
        SNAKE
      </h1>
      
      <div className="w-full max-w-md md:max-w-lg flex justify-between text-white text-lg mb-2 px-2">
        <div>Score: <span className="font-bold text-green-400">{score}</span></div>
        <div>High Score: <span className="font-bold text-yellow-400">{highScore}</span></div>
      </div>

      <div className="relative border-4 border-green-500 rounded-lg shadow-2xl shadow-green-500/20">
        {gameState === 'IDLE' && (
          <GameOverlay>
            <h2 className="text-3xl font-bold mb-4">Ready to Play?</h2>
            <button
              onClick={handleStartGame}
              className="px-6 py-3 bg-green-600 hover:bg-green-700 rounded-lg text-xl font-bold transition-transform transform hover:scale-105"
            >
              Start Game
            </button>
          </GameOverlay>
        )}
        {gameState === 'GAME_OVER' && (
          <GameOverlay>
            <h2 className="text-4xl font-bold text-red-500 mb-2">Game Over</h2>
            <p className="text-xl mb-4">Your Score: {score}</p>
            <button
              onClick={handleResetGame}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-xl font-bold transition-transform transform hover:scale-105"
            >
              Play Again
            </button>
          </GameOverlay>
        )}
        <div 
          className="grid gap-px bg-gray-700"
          style={{
            gridTemplateColumns: `repeat(${BOARD_SIZE}, 1fr)`,
            gridTemplateRows: `repeat(${BOARD_SIZE}, 1fr)`,
          }}
        >
          {Array.from({ length: BOARD_SIZE * BOARD_SIZE }).map((_, i) => {
            const x = i % BOARD_SIZE;
            const y = Math.floor(i / BOARD_SIZE);
            return (
              <div
                key={i}
                className={`w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 transition-colors duration-100 ${getCellClass(x, y)}`}
              />
            );
          })}
        </div>
      </div>
      <Controls onDirectionChange={changeDirection} />
      <div className="mt-4 text-gray-400 text-center text-sm">
        <p className="hidden md:block">Use Arrow Keys or WASD to move.</p>
        <p className="md:hidden">Use the controls to move.</p>
      </div>
    </div>
  );
};

export default App;