import React, { useEffect, useState } from 'react';
import { charToKeys } from '../utils/keyMapping';

const KEY_LABELS_ROW1 = [1, 2, 3, 4, 5];
const KEY_LABELS_ROW2 = [6, 7, 8, 9, 10];

export default function KeyboardView({ lastChar }) {
  const [activeKeys, setActiveKeys] = useState([]);
  const [displayChar, setDisplayChar] = useState('');

  useEffect(() => {
    if (!lastChar) return;

    // Resolve physical keys from mapping
    const mapping = charToKeys[lastChar];
    if (mapping) {
      setActiveKeys(mapping.keys);
      setDisplayChar(lastChar === ' ' ? '␣' : lastChar.toUpperCase());
    } else {
      // Unknown character fallback
      setActiveKeys([]);
      setDisplayChar('?');
    }

    // Auto-clear highlight after 400ms to allow visual reset for rapid typing
    const timer = setTimeout(() => {
      setActiveKeys([]);
    }, 400);

    return () => clearTimeout(timer);
  }, [lastChar]);

  const renderKey = (num) => {
    const isActive = activeKeys.includes(num);

    return (
      <div
        key={num}
        className={`w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 rounded-2xl flex items-center justify-center font-bold text-xl md:text-2xl transition-all duration-150 relative overflow-hidden ${
          isActive
            ? 'bg-green-500/20 border-2 border-green-400 text-green-300 scale-95 shadow-[0_0_20px_#4ade8040]'
            : 'bg-gray-800 border-2 border-gray-700 text-gray-500 scale-100'
        }`}
      >
        K{num}
        {isActive && (
          <div className="absolute inset-0 bg-green-400/10 blur-md pointer-events-none" />
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center justify-center py-8">
      {/* Character pop-up display */}
      <div className="h-16 mb-4 flex items-center justify-center">
        <span
          key={`char-${Date.now()}`} // force re-mount for animation
          className={`text-6xl font-black text-white animate-pop`}
          style={{ opacity: activeKeys.length > 0 ? 1 : 0 }}
        >
          {displayChar}
        </span>
      </div>

      {/* Keyboard layout */}
      <div className="bg-gray-900 border border-gray-800 p-6 md:p-8 rounded-3xl shadow-2xl flex flex-col gap-4">
        <div className="flex gap-4 justify-center">
          {KEY_LABELS_ROW1.map(renderKey)}
        </div>
        <div className="flex gap-4 justify-center">
          {KEY_LABELS_ROW2.map(renderKey)}
        </div>
      </div>
    </div>
  );
}
