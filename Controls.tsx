import React from 'react';
import { Direction } from './types';

interface ControlsProps {
  onDirectionChange: (direction: Direction) => void;
}

const ArrowIcon: React.FC<{ rotationClass: string }> = ({ rotationClass }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={`h-8 w-8 md:h-10 md:w-10 text-green-200 transform ${rotationClass}`}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={3}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
  </svg>
);

const ControlButton: React.FC<{
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
  ariaLabel: string;
}> = ({ onClick, children, className, ariaLabel }) => (
  <button
    type="button"
    aria-label={ariaLabel}
    onMouseDown={(e) => { e.preventDefault(); onClick(); }}
    onTouchStart={(e) => { e.preventDefault(); onClick(); }}
    className={`bg-gray-700/80 hover:bg-gray-600/90 active:bg-gray-500/90 rounded-2xl flex items-center justify-center transition-colors duration-150 ease-in-out select-none focus:outline-none focus:ring-2 focus:ring-green-500 ${className}`}
  >
    {children}
  </button>
);

const Controls: React.FC<ControlsProps> = ({ onDirectionChange }) => {
  return (
    <div className="grid grid-cols-3 grid-rows-3 gap-2 w-48 h-48 md:w-56 md:h-56 mt-4">
      <ControlButton
        className="col-start-2 row-start-1"
        onClick={() => onDirectionChange(Direction.UP)}
        ariaLabel="Move up"
      >
        <ArrowIcon rotationClass="-rotate-90" />
      </ControlButton>
      <ControlButton
        className="col-start-1 row-start-2"
        onClick={() => onDirectionChange(Direction.LEFT)}
        ariaLabel="Move left"
      >
        <ArrowIcon rotationClass="rotate-180" />
      </ControlButton>
      <ControlButton
        className="col-start-3 row-start-2"
        onClick={() => onDirectionChange(Direction.RIGHT)}
        ariaLabel="Move right"
      >
        <ArrowIcon rotationClass="" />
      </ControlButton>
      <ControlButton
        className="col-start-2 row-start-3"
        onClick={() => onDirectionChange(Direction.DOWN)}
        ariaLabel="Move down"
      >
        <ArrowIcon rotationClass="rotate-90" />
      </ControlButton>
    </div>
  );
};

export default Controls;