/**
 * Types for our King Gizzard lyrics data
 */

export interface Song {
  id: number;
  title: string;
  artist: string;
  album: Album | null;
  year: string | null;
  lyrics: string;
  url: string;
}

export interface Album {
  api_path: string;
  cover_art_url: string;
  full_title: string;
  id: number;
  name: string;
  url: string;
  release_date_for_display?: string;
}

/**
 * Calculated statistics for a song
 */
export interface SongStats extends Song {
  titleMentionCount: number; // How many times title appears
  titleMentionPercentage: number; // What % of words are the title
  totalWords: number; // Total word count in lyrics
}
