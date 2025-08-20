import React from 'react';

export const TrophyIcon = ({ size=14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M8 4h8" />
    <path d="M9 4v3a3 3 0 0 0 6 0V4" />
    <path d="M4 4h4v3a4 4 0 0 1-4-4Z" />
    <path d="M20 4h-4v3a4 4 0 0 0 4-4Z" />
    <path d="M12 14v5" />
    <path d="M8 21h8" />
  </svg>
);

export const FlameIcon = ({ size=14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2s.5 4-2 6c0 0-.5-2-2-2 0 0-1 5 4 8 0 0 5-3 5-8 0-2-1-4-1-4s.5 3-2 5c0 0-.5-3-2-5Z" />
    <path d="M12 22a6 6 0 0 1-6-6c0-1 .25-2 .7-3.1C8 16 12 18 12 18s4-2 5.3-5.1c.45 1.1.7 2.1.7 3.1a6 6 0 0 1-6 6Z" />
  </svg>
);

export const BadgeIcon = ({ size=14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2 7 4l-5 4 2 7 5 5h6l5-5 2-7-5-4-5-2Z" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);
