import React, { useRef, useEffect } from 'react';
import Lottie from 'lottie-react';
import animationData from './laundrix.json';

function PreLoader() {
  const lottieRef = useRef(null);

  const setAnimationSpeed = (speed) => {
    if (lottieRef.current) {
      lottieRef.current.setSpeed(speed);
    }
  };

  useEffect(() => {
    setAnimationSpeed(1.5);
  }, []);

  return (
    <div className="flex items-center justify-center h-screen">
      <Lottie
        animationData={animationData}
        style={{ height: '15rem' }}
        lottieRef={lottieRef}
      />
    </div>
  );
}

export default PreLoader;
