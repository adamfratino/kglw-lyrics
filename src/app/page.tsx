import { promises as fs } from "fs";
import path from "path";
import type { Song } from "@/types/lyrics";
import {
  analyzeAllSongs,
  sortByTitleMentions,
  sortByTitlePercentage,
} from "@/lib/analyzeLyrics";
import {
  HeroTitle,
  TitleMentionsTable,
  TitlePercentageTable,
} from "@/sections";

/**
 * Load and analyze song data (runs at build time with SSG)
 */
async function loadSongStats() {
  const filePath = path.join(process.cwd(), "data", "lyrics.json");
  const fileContents = await fs.readFile(filePath, "utf8");
  const songs: Song[] = JSON.parse(fileContents);

  const analyzed = analyzeAllSongs(songs);

  return {
    byMentions: sortByTitleMentions(analyzed),
    byPercentage: sortByTitlePercentage(analyzed),
    totalSongs: songs.length,
  };
}

export default async function Home() {
  const { byMentions, byPercentage, totalSongs } = await loadSongStats();

  return (
    <main className="relative">
      {/* Hero section with scroll animation */}
      <div className="relative h-screen">
        <HeroTitle />
      </div>

      {/* Main content */}
      <div className="relative">
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-5xl mx-auto space-y-8">
            {/* Tables */}
            <TitleMentionsTable songs={byMentions} initialLimit={10} />
            <TitlePercentageTable songs={byPercentage} initialLimit={10} />
          </div>
        </div>
      </div>
    </main>
  );
}
