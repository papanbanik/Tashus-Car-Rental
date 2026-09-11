'use client';
import React, { useEffect, useRef } from 'react';
import Fireworks from 'fireworks-js';

const FireworksComponent = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const hasShownFireworks = sessionStorage.getItem('hasShownFireworks');

    if (hasShownFireworks || !canvasRef.current) {
      return; // Don't show fireworks if already shown in this session
    }

    sessionStorage.setItem('hasShownFireworks', 'true'); // Mark as shown for this session

    const fireworks = new Fireworks(canvasRef.current, {
      particles: 50,
      opacity: 0.5,
      sound: { enabled: false },
    });

    fireworks.start();

    const stopTimeout = setTimeout(() => {
      fireworks.stop();
    }, 15000); // Stop after 15 seconds

    return () => {
      fireworks.stop();
      clearTimeout(stopTimeout);
    };
  }, []);

  return (
    <div style={{ position: 'relative' }}>
      <canvas
        ref={canvasRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100vh',
          zIndex: 9999,
          pointerEvents: 'none',
        }}
      />
    </div>
  );
};

export default FireworksComponent;
