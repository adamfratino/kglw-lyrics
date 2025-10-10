"use client";

import type { SongStats } from "@/types/lyrics";
import { SongStatsTable } from "@/components/SongStatsTable";
import { AlbumImage } from "@/components/AlbumImage";

interface TitlePercentageTableProps {
  songs: SongStats[];
  initialLimit?: number;
}

/**
 * Table showing songs with the highest title-to-lyrics ratio
 */
export function TitlePercentageTable({
  songs,
  initialLimit = 10,
}: TitlePercentageTableProps) {
  const columns = [
    {
      header: "Song",
      accessor: (song: SongStats) => song.title,
      className: "font-medium",
    },
    {
      header: "Album",
      render: (song: SongStats) => (
        <AlbumImage albumName={song.album?.name || "Unknown"} size={40} />
      ),
      className: "text-sm",
    },
    {
      header: "Percentage",
      accessor: (song: SongStats) => song.titleMentionPercentage,
      className: "font-mono",
      isBarChart: true,
      formatValue: (value: number) => `${value}%`,
    },
    {
      header: "Mentions",
      accessor: (song: SongStats) => song.titleMentionCount,
      className: "font-mono",
    },
  ];

  return (
    <SongStatsTable
      title="Highest Title-to-Lyrics Ratio"
      songs={songs}
      columns={columns}
      initialLimit={initialLimit}
      queryParamKey="ratios"
    />
  );
}
