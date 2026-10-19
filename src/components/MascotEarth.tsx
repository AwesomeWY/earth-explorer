/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface MascotEarthProps {
  emotion?: 'normal' | 'happy' | 'cheering' | 'thinking' | 'encouraging';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  isDancing?: boolean;
}

export const MascotEarth: React.FC<MascotEarthProps> = ({
  emotion = 'normal',
  size = 'md',
  className = '',
  isDancing = false,
}) => {
  const sizeMap = {
    sm: 'w-16 h-16',
    md: 'w-28 h-28',
    lg: 'w-44 h-44',
    xl: 'w-56 h-56',
  };

  return (
    <div
      className={`relative inline-flex items-center justify-center select-none ${sizeMap[size]} ${
        isDancing ? 'animate-bounce-cute' : 'animate-float'
      } ${className}`}
    >
      <svg
        viewBox="0 0 200 200"
        className="w-full h-full drop-shadow-md"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="earthGrad" x1="40" y1="30" x2="160" y2="170" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#C4F4E0" />
            <stop offset="50%" stopColor="#9DE2C7" />
            <stop offset="100%" stopColor="#7CD0B4" />
          </linearGradient>
          <linearGradient id="oceanGrad" x1="30" y1="40" x2="170" y2="160" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#A2E3FA" />
            <stop offset="100%" stopColor="#75CBED" />
          </linearGradient>
          <linearGradient id="helmetGrad" x1="100" y1="20" x2="100" y2="180" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="white" stopOpacity="0.45" />
            <stop offset="70%" stopColor="#E2F1F8" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#BAD7E5" stopOpacity="0.3" />
          </linearGradient>
          <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Orbit Ring behind Earth */}
        <ellipse
          cx="100"
          cy="105"
          rx="88"
          ry="32"
          stroke="#DCD0F5"
          strokeWidth="4"
          strokeDasharray="6 4"
          className="opacity-75"
          transform="rotate(-15 100 105)"
        />

        {/* Orbiting Tiny Moon / Saturn */}
        <g transform="rotate(-15 100 105)">
          <circle cx="184" cy="105" r="9" fill="#FFE7A0" stroke="#F5D26C" strokeWidth="2" />
          <ellipse cx="184" cy="105" rx="14" ry="4" stroke="#F0C755" strokeWidth="2" fill="none" />
        </g>

        {/* Main Earth Body (Water) */}
        <circle cx="100" cy="105" r="62" fill="url(#oceanGrad)" stroke="#66B9DB" strokeWidth="3" />

        {/* Continents (Pastel Green Landmasses) */}
        <path
          d="M70 70 C80 65, 95 68, 102 76 C106 82, 100 95, 88 98 C76 102, 65 92, 62 82 Z"
          fill="url(#earthGrad)"
        />
        <path
          d="M112 88 C125 82, 138 88, 142 98 C145 108, 135 120, 122 122 C112 124, 108 114, 106 104 Z"
          fill="url(#earthGrad)"
        />
        <path
          d="M72 124 C82 120, 96 126, 94 138 C92 148, 78 152, 70 148 C64 142, 66 130, 72 124 Z"
          fill="url(#earthGrad)"
        />

        {/* Cute Blushing Cheeks */}
        <ellipse cx="74" cy="116" rx="8" ry="5" fill="#FFC8B8" className="opacity-80" />
        <ellipse cx="126" cy="116" rx="8" ry="5" fill="#FFC8B8" className="opacity-80" />

        {/* Eyes based on emotion */}
        {emotion === 'happy' || emotion === 'cheering' ? (
          // Happy curved eyes ^^
          <g stroke="#2C3E50" strokeWidth="3.5" strokeLinecap="round" fill="none">
            <path d="M73 103 Q80 94 87 103" />
            <path d="M113 103 Q120 94 127 103" />
          </g>
        ) : emotion === 'thinking' ? (
          // Thinking curious eyes
          <g fill="#2C3E50">
            <ellipse cx="80" cy="100" rx="5" ry="6" />
            <ellipse cx="120" cy="98" rx="5" ry="6" />
            <circle cx="82" cy="98" r="2" fill="white" />
            <circle cx="122" cy="96" r="2" fill="white" />
          </g>
        ) : emotion === 'encouraging' ? (
          // Gentle warm eyes
          <g fill="#2C3E50">
            <circle cx="80" cy="102" r="5" />
            <circle cx="120" cy="102" r="5" />
            <circle cx="82" cy="100" r="1.8" fill="white" />
            <circle cx="122" cy="100" r="1.8" fill="white" />
          </g>
        ) : (
          // Normal friendly big shiny eyes
          <g fill="#2C3E50">
            <ellipse cx="80" cy="102" rx="5.5" ry="6.5" />
            <ellipse cx="120" cy="102" rx="5.5" ry="6.5" />
            {/* Eye highlights */}
            <circle cx="82" cy="100" r="2.2" fill="white" />
            <circle cx="78" cy="104" r="1.2" fill="white" />
            <circle cx="122" cy="100" r="2.2" fill="white" />
            <circle cx="118" cy="104" r="1.2" fill="white" />
          </g>
        )}

        {/* Mouth based on emotion */}
        {emotion === 'happy' || emotion === 'cheering' ? (
          // Big joyful open smile :D
          <path
            d="M89 114 Q100 128 111 114 Z"
            fill="#FF7E82"
            stroke="#2C3E50"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
        ) : emotion === 'thinking' ? (
          // Cute thoughtful small 'o' mouth
          <ellipse cx="100" cy="116" rx="4" ry="4" fill="#FF8D8D" stroke="#2C3E50" strokeWidth="2" />
        ) : emotion === 'encouraging' ? (
          // Gentle smile :)
          <path
            d="M91 114 Q100 122 109 114"
            fill="none"
            stroke="#2C3E50"
            strokeWidth="3"
            strokeLinecap="round"
          />
        ) : (
          // Classic friendly open smile
          <path
            d="M91 114 Q100 124 109 114"
            fill="none"
            stroke="#2C3E50"
            strokeWidth="3"
            strokeLinecap="round"
          />
        )}

        {/* Astronaut Helmet Bubble / Visor */}
        <circle
          cx="100"
          cy="105"
          r="68"
          fill="url(#helmetGrad)"
          stroke="#FFFFFF"
          strokeWidth="3.5"
          className="opacity-90"
        />

        {/* Helmet Highlights */}
        <path
          d="M58 80 A 64 64 0 0 1 128 50"
          stroke="white"
          strokeWidth="4"
          strokeLinecap="round"
          className="opacity-60"
          fill="none"
        />

        {/* Astronaut Helmet Antenna with Star */}
        <line x1="100" y1="37" x2="100" y2="20" stroke="#A8B2C4" strokeWidth="3" strokeLinecap="round" />
        <g transform="translate(100, 18)">
          <path
            d="M0 -9 L2.5 -3 L8.5 -2.5 L4 1.5 L5.5 7.5 L0 4.5 L-5.5 7.5 L-4 1.5 L-8.5 -2.5 L-2.5 -3 Z"
            fill="#FFE7A0"
            stroke="#F5D061"
            strokeWidth="1.5"
          />
        </g>

        {/* Little Astronaut Backpack / Wings */}
        <rect x="24" y="92" width="10" height="26" rx="5" fill="#E8F1F5" stroke="#BFD2DC" strokeWidth="2" />
        <rect x="166" y="92" width="10" height="26" rx="5" fill="#E8F1F5" stroke="#BFD2DC" strokeWidth="2" />

        {/* Floating Sparkles around */}
        <g className="animate-pulse">
          <circle cx="36" cy="48" r="3" fill="#FFE7A0" />
          <path d="M160 40 L162 44 L166 46 L162 48 L160 52 L158 48 L154 46 L158 44 Z" fill="#DCD0F5" />
          <circle cx="166" cy="154" r="2.5" fill="#FFE7A0" />
          <circle cx="42" cy="160" r="2.5" fill="#B8E6D1" />
        </g>
      </svg>
    </div>
  );
};
