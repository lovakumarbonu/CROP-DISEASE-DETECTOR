import React from 'react';

const SnakeLoader: React.FC = () => {
  const segments = 6;

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-900">
      <div className="relative w-24 h-24 flex justify-center items-center">
        {Array.from({ length: segments }).map((_, index) => (
          <div
            key={index}
            className="snake-loader-segment"
            style={{
              animationDelay: `${index * 0.1}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default SnakeLoader;
