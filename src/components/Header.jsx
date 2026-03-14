import React from 'react';

export default function Header({
  isConnected,
  isSimulating,
  onConnect,
  onConnectBluetooth,
  onDisconnect,
  onToggleSimulate,
  voiceEnabled,
  onToggleVoice,
  learningMode,
  onToggleLearning,
  blindMode,
  onToggleBlind,
}) {
  return (
    <header className="flex flex-col md:flex-row items-center justify-between p-6 bg-gray-900 border-b border-gray-800 text-white">
      <div className="flex items-center gap-4 mb-4 md:mb-0">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
          TouchKey Trainer
        </h1>

        <div className="flex items-center gap-2 ml-4 px-3 py-1 rounded-full bg-gray-800 border border-gray-700 text-sm font-medium">
          <div
            className={`w-3 h-3 rounded-full ${
              isConnected
                ? 'bg-green-500 shadow-[0_0_8px_#22c55e]'
                : isSimulating
                ? 'bg-yellow-500 shadow-[0_0_8px_#eab308]'
                : 'bg-red-500 shadow-[0_0_8px_#ef4444]'
            }`}
          ></div>
          <span>
            {isConnected ? 'USB Connected' : isSimulating ? 'Simulating' : 'Disconnected'}
          </span>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        {/* Toggle Controls */}
        <div className="flex gap-4 p-2 bg-gray-800 rounded-lg border border-gray-700">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={voiceEnabled}
              onChange={(e) => onToggleVoice(e.target.checked)}
            />
            <div className="w-9 h-5 bg-gray-600 rounded-full peer peer-checked:bg-green-500 peer-focus:ring-2 peer-focus:ring-green-500/50 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-full relative"></div>
            <span className="text-sm font-medium text-gray-300">Voice Feedback</span>
          </label>



          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={blindMode}
              onChange={(e) => onToggleBlind(e.target.checked)}
            />
            <div className="w-9 h-5 bg-gray-600 rounded-full peer peer-checked:bg-gray-400 peer-focus:ring-2 peer-focus:ring-gray-400/50 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-gray-900 after:border-gray-600 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-full relative"></div>
            <span className="text-sm font-medium text-gray-300">Blind Mode</span>
          </label>
        </div>

        {/* Action Buttons */}
        {!isConnected && !isSimulating && (
          <div className="flex gap-2">
            <button
              onClick={onConnect}
              className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white font-semibold rounded-lg shadow-lg shadow-green-500/30 transition-all border border-green-400"
            >
              Connect USB
            </button>
            <button
              onClick={onConnectBluetooth}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg shadow-lg shadow-blue-500/30 transition-all border border-blue-400"
            >
              Connect Bluetooth
            </button>
          </div>
        )}

        {!isConnected && !isSimulating && (
          <button
            onClick={onToggleSimulate}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-lg shadow-lg transition-all border border-gray-600"
          >
            Try Simulator
          </button>
        )}

        {(isConnected || isSimulating) && (
          <button
            onClick={isConnected ? onDisconnect : onToggleSimulate}
            className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-semibold rounded-lg shadow-lg shadow-red-500/30 transition-all border border-red-500"
          >
            {isConnected ? 'Disconnect' : 'Stop Simulation'}
          </button>
        )}
      </div>
    </header>
  );
}
