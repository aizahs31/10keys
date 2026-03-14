/**
 * Key mapping configuration derived from the Arduino sketch (sketch.ino).
 *
 * The Arduino has 10 physical keys on pins [11,10,9,8,7,6,5,4,3,2].
 * We label them K1–K10 (index 0–9).
 *
 * Single press  → a b c d e f g h i j   (keys 0-9)
 * Double press  → k l m n o p q r s t   (keys 0-9)
 * Chords:
 *   K1+K2 → u    K2+K3 → v    K3+K4 → w
 *   K7+K8 → x    K8+K9 → y    K9+K10 → z
 *   K5+K6 → (space)
 */

// Character → physical key info (for keyboard visualization)
export const charToKeys = {
  // Single press (keys are 1-indexed for display)
  a: { keys: [1], method: 'single' },
  b: { keys: [2], method: 'single' },
  c: { keys: [3], method: 'single' },
  d: { keys: [4], method: 'single' },
  e: { keys: [5], method: 'single' },
  f: { keys: [6], method: 'single' },
  g: { keys: [7], method: 'single' },
  h: { keys: [8], method: 'single' },
  i: { keys: [9], method: 'single' },
  j: { keys: [10], method: 'single' },

  // Double press
  k: { keys: [1], method: 'double' },
  l: { keys: [2], method: 'double' },
  m: { keys: [3], method: 'double' },
  n: { keys: [4], method: 'double' },
  o: { keys: [5], method: 'double' },
  p: { keys: [6], method: 'double' },
  q: { keys: [7], method: 'double' },
  r: { keys: [8], method: 'double' },
  s: { keys: [9], method: 'double' },
  t: { keys: [10], method: 'double' },

  // Chords
  u: { keys: [1, 2], method: 'chord' },
  v: { keys: [2, 3], method: 'chord' },
  w: { keys: [3, 4], method: 'chord' },
  x: { keys: [7, 8], method: 'chord' },
  y: { keys: [8, 9], method: 'chord' },
  z: { keys: [9, 10], method: 'chord' },
  ' ': { keys: [5, 6], method: 'chord' },
};

// Physical key labels for keyboard visualization
export const keyLabels = [
  'K1', 'K2', 'K3', 'K4', 'K5',
  'K6', 'K7', 'K8', 'K9', 'K10',
];

// For learning mode: generate a description string
export function describeMapping(char) {
  const info = charToKeys[char];
  if (!info) return null;

  const keyNames = info.keys.map((k) => `K${k}`).join(' and ');
  const charName = char === ' ' ? 'Space' : char.toUpperCase();

  switch (info.method) {
    case 'single':
      return `Single press ${keyNames} equals ${charName}`;
    case 'double':
      return `Double press ${keyNames} equals ${charName}`;
    case 'chord':
      return `Combination ${keyNames} equals ${charName}`;
    default:
      return `${keyNames} equals ${charName}`;
  }
}
