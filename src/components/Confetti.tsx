"use client";

import { useEffect } from 'react';
import confetti from 'canvas-confetti';

interface ConfettiProps {
  duration?: number;
}

export function Confetti({ duration = 2000 }: ConfettiProps) {
  useEffect(() => {
    // Lancer des confettis
    const end = Date.now() + duration;

    // Confettis en bas
    const colors = ['#00b6ff', '#0099ff', '#26c9fc', '#73e3ff', '#00d4ff'];

    (function frame() {
      confetti({
        particleCount: 2,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: colors
      });
      
      confetti({
        particleCount: 2,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: colors
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    }());

    // Nettoyer après la fin des confettis
    return () => {
      confetti.reset();
    };
  }, [duration]);

  return null; // Ce composant ne rend rien visuellement
} 