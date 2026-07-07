import React, { useState, useEffect } from 'react';
import { Activity } from 'lucide-react';

export function LoadingScreen() {
  const statusMessages = [
    "Connecting to health centres...",
    "Loading live data...",
    "Almost ready..."
  ];

  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prevIndex) => (prevIndex + 1) % statusMessages.length);
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] bg-slate-50 text-center px-4">
      <div className="relative flex items-center justify-center w-24 h-24 mb-6">
        {/* Pulsing ring halo */}
        <div className="absolute w-full h-full rounded-full bg-indigo-100 opacity-60 animate-ping"></div>
        {/* Pulsing Core Circle with Activity icon */}
        <div className="relative flex items-center justify-center w-16 h-16 bg-indigo-600 text-white rounded-full shadow-lg shadow-indigo-600/35 animate-pulse">
          <Activity className="w-8 h-8" />
        </div>
      </div>

      {/* Rotating Status Messages */}
      <div className="h-6 overflow-hidden mb-5">
        <p className="text-slate-500 font-semibold text-sm transition-all duration-300">
          {statusMessages[messageIndex]}
        </p>
      </div>

      {/* Sequencing Bouncing Dots */}
      <div className="flex space-x-1.5 justify-center">
        <div className="w-2.5 h-2.5 bg-indigo-600 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
        <div className="w-2.5 h-2.5 bg-indigo-600 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
        <div className="w-2.5 h-2.5 bg-indigo-600 rounded-full animate-bounce"></div>
      </div>
    </div>
  );
}

export default LoadingScreen;
