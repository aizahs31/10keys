import { useState, useEffect, useRef } from 'react';
import { calcWPM, calcAccuracy } from '../utils/typingMetrics';

/**
 * Hook to track typing session progress, WPM, accuracy, and history.
 */
export function useTypingStats(targetText) {
  const [typedText, setTypedText] = useState('');
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [status, setStatus] = useState('idle'); // idle -> active -> completed
  const [history, setHistory] = useState([]);

  // Stats
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [errors, setErrors] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(60);

  // We use a ref for intervals so we can clear them reliably
  const intervalRef = useRef(null);

  // Update live stats every second if active
  useEffect(() => {
    if (status === 'active') {
      intervalRef.current = setInterval(() => {
        const now = Date.now();
        const elapsed = now - startTime;

        setWpm(calcWPM(typedText.length, elapsed));

        // Time limits (just 60 seconds fixed for this demo)
        const secondsRemaining = 60 - Math.floor(elapsed / 1000);
        setTimeRemaining(Math.max(0, secondsRemaining));

        if (secondsRemaining <= 0) {
          completeTest();
        }
      }, 500);
    }

    return () => clearInterval(intervalRef.current);
  }, [status, startTime, typedText]);

  // Handle typing a new character
  const handleChar = (char) => {
    if (status === 'completed') return;

    if (status === 'idle') {
      setStartTime(Date.now());
      setStatus('active');
    }

    const currentIndex = typedText.length;
    const isCorrect = char === targetText[currentIndex];

    // Update errors
    if (!isCorrect) {
      setErrors((prev) => prev + 1);
    }

    // Update text
    const newText = typedText + char;
    setTypedText(newText);

    // Update accuracy
    const correctCount = newText.split('').filter((c, i) => c === targetText[i]).length;
    setAccuracy(calcAccuracy(correctCount, newText.length));

    // Finish condition
    if (newText.length >= targetText.length) {
      completeTest(newText);
    }
  };

  const completeTest = (finalText = typedText) => {
    setStatus('completed');
    setEndTime(Date.now());
    clearInterval(intervalRef.current);

    // Save to history
    setHistory((prev) => [
      {
        wpm: Math.round(wpm),
        accuracy: Math.round(accuracy),
        date: new Date().toLocaleTimeString(),
      },
      ...prev,
    ].slice(0, 5)); // Keep only last 5 sessions
  };

  const restartSession = () => {
    setStatus('idle');
    setTypedText('');
    setStartTime(null);
    setEndTime(null);
    setWpm(0);
    setAccuracy(100);
    setErrors(0);
    setTimeRemaining(60);
    clearInterval(intervalRef.current);
  };

  return {
    typedText,
    status,
    wpm: Math.round(wpm),
    accuracy: Math.round(accuracy),
    errors,
    timeRemaining,
    history,
    handleChar,
    restartSession
  };
}
