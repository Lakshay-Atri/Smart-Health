import React, { useState, useEffect } from 'react';

export function LoadingScreen() {
  const statusMessages = [
    "Connecting to health centres...",
    "Loading live data...",
    "Almost ready..."
  ];

  const [messageIndex, setMessageIndex] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      // Fade out
      setFade(false);
      
      // Wait for fade transition, then change text and fade back in
      setTimeout(() => {
        setMessageIndex((prevIndex) => (prevIndex + 1) % statusMessages.length);
        setFade(true);
      }, 300);
    }, 1600);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] w-full bg-slate-50 text-center px-6 py-12 select-none">
      {/* ECG Heartbeat Monitor Container */}
      <div className="w-full max-w-sm h-32 flex items-center justify-center bg-white border border-slate-100 rounded-3xl shadow-sm px-6 mb-8 relative overflow-hidden">
        {/* Subtle grid background for hospital monitor look */}
        <div 
          className="absolute inset-0 opacity-[0.03] pointer-events-none" 
          style={{
            backgroundImage: `
              linear-gradient(to right, #6366f1 1px, transparent 1px),
              linear-gradient(to bottom, #6366f1 1px, transparent 1px)
            `,
            backgroundSize: '15px 15px'
          }}
        ></div>

        <svg 
          viewBox="0 0 300 100" 
          className="w-full h-full relative z-10"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Soft Glow Filter */}
            <filter id="ecg-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="2.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* Sweep Mask Gradient: reveals line from left, soft fading trail */}
            <linearGradient id="mask-grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="black" stopOpacity="0" />
              <stop offset="30%" stopColor="white" stopOpacity="0.15" />
              <stop offset="85%" stopColor="white" stopOpacity="1" />
              <stop offset="98%" stopColor="white" stopOpacity="1" />
              <stop offset="100%" stopColor="black" stopOpacity="0" />
            </linearGradient>

            {/* Mask using the sliding rectangle */}
            <mask id="ecg-mask">
              <rect x="-100" y="0" width="100" height="100" fill="url(#mask-grad)">
                <animate 
                  attributeName="x" 
                  from="-100" 
                  to="300" 
                  dur="1.6s" 
                  repeatCount="indefinite" 
                />
              </rect>
            </mask>
          </defs>

          {/* Background trace line (very faint placeholder) */}
          <path
            d="M 0,50 L 100,50 L 110,42 L 120,50 L 125,50 L 130,58 L 137,12 L 144,85 L 150,50 L 155,50 L 165,42 L 175,50 L 300,50"
            fill="none"
            stroke="#6366f1"
            strokeWidth="2"
            className="opacity-[0.07]"
          />

          {/* Active scanning glowing ECG line */}
          <path
            d="M 0,50 L 100,50 L 110,42 L 120,50 L 125,50 L 130,58 L 137,12 L 144,85 L 150,50 L 155,50 L 165,42 L 175,50 L 300,50"
            fill="none"
            stroke="#6366f1"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#ecg-glow)"
            mask="url(#ecg-mask)"
          />
        </svg>
      </div>

      {/* Rotating Status Messages */}
      <div className="h-6 overflow-hidden">
        <p 
          className={`text-slate-500 font-semibold text-xs tracking-wider uppercase transition-opacity duration-300 ${
            fade ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {statusMessages[messageIndex]}
        </p>
      </div>
    </div>
  );
}

export default LoadingScreen;
