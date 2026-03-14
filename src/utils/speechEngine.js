/**
 * Speech engine utility using the Web Speech API.
 * Provides character announcement and learning mode descriptions.
 */

let enabled = true;

export function setSpeechEnabled(value) {
  enabled = value;
  if (!value) {
    window.speechSynthesis.cancel();
  }
}

export function isSpeechEnabled() {
  return enabled;
}

/**
 * Speak a short text immediately.
 * Cancels any ongoing speech first for instant feedback.
 */
export function speak(text) {
  if (!enabled || !window.speechSynthesis) return;

  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 3.0; // Very fast rate for quick typing feedback
  utterance.pitch = 1.0;
  utterance.volume = 1.0;
  utterance.lang = 'en-US';

  window.speechSynthesis.speak(utterance);
}

/**
 * Speak a character name (e.g., "A", "Space").
 */
export function speakChar(char) {
  if (char === ' ') {
    speak('Space');
  } else {
    speak(char.toUpperCase());
  }
}

/**
 * Speak learning mode description (e.g., "Combination K1 and K2 equals U").
 */
export function speakLearning(description) {
  speak(description);
}

/**
 * Announce typing feedback.
 */
export function speakCorrect() {
  // Optional subtle feedback — keep it silent for speed.
}

export function speakIncorrect() {
  speak('wrong');
}

export function speakTestComplete(wpm, accuracy) {
  speak(`Test complete. Your speed is ${Math.round(wpm)} words per minute with ${Math.round(accuracy)} percent accuracy.`);
}
