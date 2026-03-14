import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import KeyboardView from './components/KeyboardView';
import TypingArea from './components/TypingArea';
import StatsPanel from './components/StatsPanel';

import { useSerialConnection } from './hooks/useSerialConnection';
import { useTypingStats } from './hooks/useTypingStats';
import { setSpeechEnabled, speakChar, speakLearning, speakTestComplete, speakIncorrect } from './utils/speechEngine';
import { describeMapping } from './utils/keyMapping';
import paragraphsData from './data/paragraphs.json';

import './index.css';

export default function App() {
  // Global App State
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [learningMode, setLearningMode] = useState(false);
  const [blindMode, setBlindMode] = useState(false);
  const [difficulty, setDifficulty] = useState('beginner');
  const [targetText, setTargetText] = useState('');

  // Apply speech setting
  useEffect(() => {
    setSpeechEnabled(voiceEnabled);
  }, [voiceEnabled]);

  // Load a random paragraph when difficulty changes
  useEffect(() => {
    loadNewParagraph(difficulty);
  }, [difficulty]);

  const loadNewParagraph = (diff) => {
    const arr = paragraphsData[diff];
    if (arr && arr.length > 0) {
      const idx = Math.floor(Math.random() * arr.length);
      setTargetText(arr[idx]);
    }
    // Also restart stats when new paragraph loaded
    restartSession();
  };

  // Callback when a character is received (either via hardware serial or keyboard simulation)
  const handleCharReceived = (char) => {
    // 1. Process typing stats
    handleChar(char);

    // 2. Play speech feedback if enabled
    if (voiceEnabled) {
      speakChar(char);
    }
  };

  // Hooks
  const {
    isConnected,
    isSimulating,
    lastChar,
    connect,
    connectBluetooth,
    disconnect,
    toggleSimulation
  } = useSerialConnection(handleCharReceived);

  const {
    typedText,
    status,
    wpm,
    accuracy,
    errors,
    timeRemaining,
    history,
    handleChar,
    restartSession
  } = useTypingStats(targetText);

  // When test finishes, announce final score if voice enabled
  useEffect(() => {
    if (status === 'completed' && voiceEnabled) {
      speakTestComplete(wpm, accuracy);
    }
  }, [status, voiceEnabled, wpm, accuracy]);

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-green-500/30">
      <Header
        isConnected={isConnected}
        isSimulating={isSimulating}
        onConnect={connect}
        onConnectBluetooth={connectBluetooth}
        onDisconnect={disconnect}
        onToggleSimulate={toggleSimulation}
        voiceEnabled={voiceEnabled}
        onToggleVoice={setVoiceEnabled}
        learningMode={learningMode}
        onToggleLearning={setLearningMode}
        blindMode={blindMode}
        onToggleBlind={setBlindMode}
      />

      <main className="container mx-auto px-4 py-8 flex flex-col gap-8 max-w-6xl">
        <TypingArea
          targetText={targetText}
          typedText={typedText}
          status={status}
          difficulty={difficulty}
          onDifficultyChange={setDifficulty}
          onRestart={() => loadNewParagraph(difficulty)}
          blindMode={blindMode}
        />

        <KeyboardView lastChar={lastChar} />

        <StatsPanel
          wpm={wpm}
          accuracy={accuracy}
          errors={errors}
          timeRemaining={timeRemaining}
          history={history}
        />
      </main>
      
      {/* Simulation hint float */}
      {isSimulating && (
        <div className="fixed bottom-4 right-4 bg-yellow-900/80 border border-yellow-700 text-yellow-200 px-4 py-2 rounded-xl shadow-lg backdrop-blur-sm z-50 text-sm animate-pulse">
          Simulating hardware — type anywhere!
        </div>
      )}
    </div>
  );
}
