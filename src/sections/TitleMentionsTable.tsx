"use client";

import type { SongStats } from "@/types/lyrics";
import { SongStatsTable } from "@/components/SongStatsTable";
import { AlbumImage } from "@/components/AlbumImage";

interface TitleMentionsTableProps {
  songs: SongStats[];
  initialLimit?: number;
}

/**
 * Table showing songs with the most title mentions
 */
export function TitleMentionsTable({
  songs,
  initialLimit = 10,
}: TitleMentionsTableProps) {
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
      header: "Mentions",
      accessor: (song: SongStats) => song.titleMentionCount,
      className: "font-mono",
      isBarChart: true,
    },
    {
      header: "Total Words",
      accessor: (song: SongStats) => song.totalWords,
      align: "right" as const,
      className: "font-mono",
    },
  ];

  return (
    <SongStatsTable
      title="Most Title Mentions"
      songs={songs}
      columns={columns}
      initialLimit={initialLimit}
      queryParamKey="mentions"
    />
  );
}
