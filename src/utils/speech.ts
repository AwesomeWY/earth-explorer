/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export function speakEnglishWord(word: string): void {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return;
  }

  try {
    window.speechSynthesis.cancel(); // Stop any pending utterance
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = 'en-US';
    utterance.rate = 0.85; // Slightly slower for elementary learner comprehension
    utterance.pitch = 1.05; // Friendly and clear
    window.speechSynthesis.speak(utterance);
  } catch {
    // Graceful fallback
  }
}
