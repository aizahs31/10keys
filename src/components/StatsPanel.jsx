import React from 'react';

export default function StatsPanel({ wpm, accuracy, errors, timeRemaining, history }) {
  return (
    <div className="flex flex-col lg:flex-row gap-6 w-full max-w-5xl mx-auto px-4 my-8">
      {/* Current Session Stats */}
      <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gray-900 border border-gray-800 p-6 rounded-3xl shadow-xl flex flex-col items-center justify-center relative overflow-hidden group">
          <div className="absolute -inset-0 bg-green-500/10 blur-xl opacity-0 group-hover:opacity-100 transition duration-500"></div>
          <span className="text-gray-400 text-sm font-semibold uppercase tracking-wider mb-2 z-10">WPM</span>
          <span className="text-5xl font-black text-green-400 tracking-tighter z-10">{wpm}</span>
        </div>

        <div className="bg-gray-900 border border-gray-800 p-6 rounded-3xl shadow-xl flex flex-col items-center justify-center relative overflow-hidden group">
          <div className="absolute -inset-0 bg-green-500/10 blur-xl opacity-0 group-hover:opacity-100 transition duration-500"></div>
          <span className="text-gray-400 text-sm font-semibold uppercase tracking-wider mb-2 z-10">Accuracy</span>
          <span className="text-5xl font-black text-green-400 tracking-tighter z-10">{accuracy}%</span>
        </div>

        <div className="bg-gray-900 border border-gray-800 p-6 rounded-3xl shadow-xl flex flex-col items-center justify-center relative overflow-hidden group">
          <div className="absolute -inset-0 bg-red-500/10 blur-xl opacity-0 group-hover:opacity-100 transition duration-500"></div>
          <span className="text-gray-400 text-sm font-semibold uppercase tracking-wider mb-2 z-10">Errors</span>
          <span className="text-5xl font-black text-red-400 tracking-tighter z-10">{errors}</span>
        </div>

        <div className="bg-gray-900 border border-gray-800 p-6 rounded-3xl shadow-xl flex flex-col items-center justify-center relative overflow-hidden group">
          <div className="absolute -inset-0 bg-emerald-500/10 blur-xl opacity-0 group-hover:opacity-100 transition duration-500"></div>
          <span className="text-gray-400 text-sm font-semibold uppercase tracking-wider mb-2 z-10">Time Left</span>
          <span className={`text-5xl font-black tracking-tighter z-10 ${timeRemaining <= 10 ? 'text-red-500 animate-pulse' : 'text-emerald-400'}`}>
            {timeRemaining}s
          </span>
        </div>
      </div>

      {/* Session History */}
      {history.length > 0 && (
        <div className="lg:w-72 bg-gray-900 border border-gray-800 p-6 rounded-3xl shadow-xl flex flex-col">
          <h3 className="text-gray-300 font-semibold mb-4 border-b border-gray-800 pb-2">Recent Sessions</h3>
          <div className="flex flex-col gap-3">
            {history.map((session, index) => (
              <div key={index} className="flex justify-between items-center text-sm p-2 rounded-lg bg-gray-800/50">
                <span className="text-gray-400">{session.date}</span>
                <div className="flex gap-3 font-mono font-semibold">
                  <span className="text-green-400">{session.wpm}W</span>
                  <span className="text-green-400">{session.accuracy}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
