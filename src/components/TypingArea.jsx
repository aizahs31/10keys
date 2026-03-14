import React, { useEffect, useRef } from 'react';

export default function TypingArea({
  targetText,
  typedText,
  status,
  difficulty,
  onDifficultyChange,
  onRestart,
  blindMode,
}) {
  const containerRef = useRef(null);

  // Auto-scroll logic so the active line stays visible
  useEffect(() => {
    if (!containerRef.current) return;
    const activeChar = containerRef.current.querySelector('.cursor-active');
    if (activeChar) {
      activeChar.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [typedText]);

  // If blind mode is enabled, hide the text completely
  if (blindMode) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-gray-900 rounded-3xl min-h-[300px] border border-gray-800 shadow-xl w-full max-w-4xl mx-auto">
        <div className="mb-8 flex justify-between w-full">
          <select
            value={difficulty}
            onChange={(e) => onDifficultyChange(e.target.value)}
            className="bg-gray-800 text-white border border-gray-700 px-4 py-2 rounded-lg focus:outline-none focus:border-green-500"
          >
            <option value="beginner">Beginner</option>
            <option value="medium">Medium</option>
            <option value="advanced">Advanced</option>
          </select>
          <button
            onClick={onRestart}
            className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white font-medium rounded-lg border border-gray-700 transition"
          >
            Restart
          </button>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center space-y-4">
          <svg className="w-16 h-16 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
          </svg>
          <p className="text-gray-500 text-lg">Blind Mode Active</p>
          <p className="text-gray-600">Rely on auditory feedback only.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center p-6 md:p-8 bg-gray-900 rounded-3xl min-h-[300px] border border-gray-800 shadow-xl w-full max-w-4xl mx-auto transition-all">
      {/* Controls */}
      <div className="mb-8 flex justify-between w-full max-w-3xl">
        <select
          value={difficulty}
          onChange={(e) => onDifficultyChange(e.target.value)}
          className="bg-gray-800 text-gray-300 border border-gray-700 px-4 py-2 rounded-lg focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition cursor-pointer"
        >
          <option value="beginner">Beginner</option>
          <option value="medium">Medium</option>
          <option value="advanced">Advanced</option>
        </select>
        <button
          onClick={onRestart}
          className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 font-medium rounded-lg border border-gray-700 transition flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Restart
        </button>
      </div>

      {/* Main typing area */}
      <div
        ref={containerRef}
        className="w-full max-w-3xl text-2xl md:text-3xl leading-relaxed font-medium font-mono text-gray-600 text-left select-none relative"
        style={{ wordSpacing: '0.2rem' }}
      >
        {status === 'completed' && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-gray-900/80 backdrop-blur-sm rounded-xl">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
              Challenge Complete!
            </h2>
          </div>
        )}

        {/* Display characters */}
        {targetText.split('').map((char, index) => {
          const typedChar = typedText[index];
          let className = "transition-all duration-100 ";

          if (!typedChar) {
            // Not typed yet
            className += "text-gray-600";
          } else if (typedChar === char) {
            // Correct
            className += "text-green-400 font-semibold";
          } else {
            // Incorrect
            className += "text-red-500 bg-red-500/10 rounded font-semibold underline decoration-red-500 decoration-2";
          }

          if (index === typedText.length && status !== 'completed') {
            // Current cursor position
            className += " cursor-active border-l-2 border-green-400 animate-pulse bg-green-900/40 rounded shadow-[0_0_8px_#4ade80] z-10 relative";
          }

          // Show visible space indicator if space is typed incorrectly
          const displayChar = char === ' ' && typedChar && typedChar !== ' ' ? '_' : char;

          return (
            <span key={index} className={className}>
              {displayChar}
            </span>
          );
        })}
      </div>
    </div>
  );
}
