"use client";
import { useEffect, useState } from 'react';

export default function PartyPopperEffect({ isActive, onComplete }) {
  const [confetti, setConfetti] = useState([]);
  const [showEffect, setShowEffect] = useState(false);

  useEffect(() => {
    if (isActive) {
      setShowEffect(true);
      generateConfetti();
      
      // Auto-hide after animation
      const timer = setTimeout(() => {
        setShowEffect(false);
        onComplete?.();
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [isActive, onComplete]);

  const generateConfetti = () => {
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8'];
    const newConfetti = [];

    for (let i = 0; i < 50; i++) {
      newConfetti.push({
        id: i,
        x: Math.random() * 100,
        y: -10,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 8 + 4,
        speedX: (Math.random() - 0.5) * 4,
        speedY: Math.random() * 3 + 2,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 10,
      });
    }
    setConfetti(newConfetti);
  };

  if (!showEffect) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {confetti.map((piece) => (
        <div
          key={piece.id}
          className="absolute animate-confetti-fall"
          style={{
            left: `${piece.x}%`,
            top: `${piece.y}%`,
            width: `${piece.size}px`,
            height: `${piece.size}px`,
            backgroundColor: piece.color,
            transform: `rotate(${piece.rotation}deg)`,
            borderRadius: '2px',
            animation: `confetti-fall 4s linear forwards, confetti-rotate 1s linear infinite`,
          }}
        />
      ))}
      
      {/* Fireworks effect */}
      <div className="absolute top-1/4 left-1/4 w-4 h-4 animate-ping">
        <div className="w-full h-full bg-yellow-400 rounded-full opacity-75"></div>
      </div>
      <div className="absolute top-1/3 right-1/4 w-3 h-3 animate-ping delay-300">
        <div className="w-full h-full bg-pink-400 rounded-full opacity-75"></div>
      </div>
      <div className="absolute top-1/2 left-1/3 w-5 h-5 animate-ping delay-500">
        <div className="w-full h-full bg-blue-400 rounded-full opacity-75"></div>
      </div>
    </div>
  );
}