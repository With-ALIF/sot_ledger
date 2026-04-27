import React from 'react';

export default function Logo({ className = "h-8" }: { className?: string }) {
  return (
    <svg 
      viewBox="0 0 600 200" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Background - transparent instead of white for better UI integration */}
      <rect width="600" height="200" fill="transparent"/>

      {/* Gradient Definitions */}
      <defs>
        <linearGradient id="cardGradient" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#0A66C2"/>
          <stop offset="100%" stopColor="#0047AB"/>
        </linearGradient>

        <linearGradient id="arrowGradient" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#00C853"/>
          <stop offset="100%" stopColor="#64DD17"/>
        </linearGradient>
      </defs>

      {/* Card Shape */}
      <rect x="60" y="70" rx="15" ry="15" width="160" height="100" fill="url(#cardGradient)"/>

      {/* Card Details */}
      <rect x="80" y="95" width="100" height="15" fill="white" opacity="0.3"/>
      <rect x="80" y="120" width="60" height="10" fill="white" opacity="0.3"/>

      {/* Growth Arrow */}
      <path d="M70 150 Q140 80 210 90" 
            stroke="url(#arrowGradient)" 
            strokeWidth="12" 
            fill="none" 
            strokeLinecap="round"/>

      {/* Arrow Head */}
      <polygon points="200,75 240,85 210,110" fill="url(#arrowGradient)"/>

      {/* Brand Text */}
      <text x="260" y="120" fontFamily="Segoe UI, Arial, sans-serif" fontSize="48" fontWeight="700" fill="#0A66C2">
        Payment
      </text>

      <text x="260" y="165" fontFamily="Segoe UI, Arial, sans-serif" fontSize="48" fontWeight="700" fill="#00C853">
        SOT
      </text>
    </svg>
  );
}
