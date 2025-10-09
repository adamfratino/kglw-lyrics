import type { Song, SongStats } from "@/types/lyrics";

/**
 * CONCEPT 0: Symbol Substitutions
 *
 * Map special symbols to their word equivalents
 * Add new entries here as you discover them!
 *
 * Example: "Danger $$$" → "Danger money"
 */
const SYMBOL_SUBSTITUTIONS: Record<string, string> = {
  $$$: "money",
  $$: "money",
  $: "dollar",
  "€": "euro",
  "£": "pound",
  "&": "and",
  "%": "percent",
  "#": "number",
  "@": "at",
  // Add more as needed
};

/**
 * Apply symbol substitutions before normalization
 */
function applySubstitutions(text: string): string {
  let result = text;

  // Replace each symbol with its word equivalent
  for (const [symbol, word] of Object.entries(SYMBOL_SUBSTITUTIONS)) {
    // Use global replace to catch all instances
    result = result.replaceAll(symbol, ` ${word} `);
  }

  return result;
}

/**
 * CONCEPT 1: String Normalization
 *
 * Problem: "Robot Stop" could appear as "robot stop", "Robot, stop!", "ROBOT STOP"
 * Solution: Normalize both the title and lyrics to compare fairly
 */
function normalizeText(text: string): string {
  return text
    .toLowerCase() // "Robot Stop" → "robot stop"
    .replace(/[^\w\s]/g, " ") // Remove punctuation: "stop!" → "stop "
    .replace(/\s+/g, " ") // Collapse multiple spaces → single space
    .trim(); // Remove leading/trailing spaces
}

/**
 * Complete normalization: substitutions + normalization
 */
function normalizeTextWithSubstitutions(text: string): string {
  const substituted = applySubstitutions(text);
  return normalizeText(substituted);
}

/**
 * CONCEPT 2: Word Splitting
 *
 * Split text into an array of words for counting
 * Example: "robot stop here" → ["robot", "stop", "here"]
 * Example with substitutions: "danger $$$" → ["danger", "money"]
 */
function getWords(text: string): string[] {
  const normalized = normalizeTextWithSubstitutions(text);
  return normalized.split(" ").filter((word) => word.length > 0);
}

/**
 * CONCEPT 3: Substring Matching with Sliding Window
 *
 * Count how many times a phrase appears in text
 *
 * Why not just text.includes()? Because we need to count ALL occurrences!
 *
 * Example:
 * - Title: "robot stop" (2 words)
 * - Lyrics: "robot stop the robot stop now"
 * - Should find it twice!
 *
 * How it works:
 * 1. Convert both to word arrays
 * 2. "Slide" the title-sized window across lyrics
 * 3. Check if each window matches the title
 */
function countTitleMentions(title: string, lyrics: string): number {
  const titleWords = getWords(title);
  const lyricsWords = getWords(lyrics);

  // Edge case: If title is longer than lyrics, can't possibly match
  if (titleWords.length > lyricsWords.length) {
    return 0;
  }

  let count = 0;
  const titleLength = titleWords.length;

  // Sliding window: Check each possible position
  for (let i = 0; i <= lyricsWords.length - titleLength; i++) {
    // Extract a "window" of words the same length as the title
    const window = lyricsWords.slice(i, i + titleLength);

    // Check if this window matches the title exactly
    const matches = window.every((word, index) => word === titleWords[index]);

    if (matches) {
      count++;
      // Optional: Skip ahead to avoid counting overlaps
      // i += titleLength - 1;
    }
  }

  return count;
}

/**
 * CONCEPT 4: Percentage Calculation
 *
 * Formula: (title word count / total words) × 100
 *
 * Example:
 * - Title "robot stop" appears 3 times = 3 × 2 = 6 title words
 * - Total lyrics = 100 words
 * - Percentage = (6 / 100) × 100 = 6%
 */
function calculateTitlePercentage(
  titleMentionCount: number,
  titleWordCount: number,
  totalWords: number
): number {
  if (totalWords === 0) return 0;

  const titleWordsInLyrics = titleMentionCount * titleWordCount;
  const percentage = (titleWordsInLyrics / totalWords) * 100;

  // Round to 2 decimal places for readability
  return Math.round(percentage * 100) / 100;
}

/**
 * MAIN FUNCTION: Analyze a single song
 *
 * This puts all the concepts together!
 */
export function analyzeSong(song: Song): SongStats {
  const titleMentionCount = countTitleMentions(song.title, song.lyrics);
  const titleWords = getWords(song.title);
  const totalWords = getWords(song.lyrics).length;

  const titleMentionPercentage = calculateTitlePercentage(
    titleMentionCount,
    titleWords.length,
    totalWords
  );

  return {
    ...song,
    titleMentionCount,
    titleMentionPercentage,
    totalWords,
  };
}

/**
 * Batch analyze all songs
 *
 * CONCEPT 5: Array.map() for transformations
 * Takes an array of Songs, returns array of SongStats
 */
export function analyzeAllSongs(songs: Song[]): SongStats[] {
  return songs.map(analyzeSong);
}

/**
 * CONCEPT 6: Sorting
 *
 * Find the most interesting stats!
 */
export function sortByTitleMentions(songs: SongStats[]): SongStats[] {
  // Sort descending (highest first)
  return [...songs].sort((a, b) => b.titleMentionCount - a.titleMentionCount);
}

export function sortByTitlePercentage(songs: SongStats[]): SongStats[] {
  return [...songs].sort(
    (a, b) => b.titleMentionPercentage - a.titleMentionPercentage
  );
}
