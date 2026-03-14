/**
 * Pure utility functions for typing metrics calculation.
 */

/**
 * Calculate Words Per Minute.
 * WPM = (charactersTyped / 5) / minutes
 *
 * @param {number} charsTyped - total characters typed
 * @param {number} elapsedMs - elapsed time in milliseconds
 * @returns {number} WPM value
 */
export function calcWPM(charsTyped, elapsedMs) {
  if (elapsedMs <= 0) return 0;
  const minutes = elapsedMs / 60000;
  return (charsTyped / 5) / minutes;
}

/**
 * Calculate accuracy as a percentage.
 *
 * @param {number} correctChars - number of correct characters
 * @param {number} totalChars - total characters typed
 * @returns {number} accuracy percentage (0-100)
 */
export function calcAccuracy(correctChars, totalChars) {
  if (totalChars <= 0) return 100;
  return (correctChars / totalChars) * 100;
}
