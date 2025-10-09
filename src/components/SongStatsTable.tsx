"use client";

import { useState } from "react";
import type { SongStats } from "@/types/lyrics";

/**
 * Column configuration for flexible table rendering
 */
interface Column {
  header: string;
  accessor: (song: SongStats) => string | number;
  align?: "left" | "right";
  className?: string;
}

interface SongStatsTableProps {
  title: string;
  songs: SongStats[];
  columns: Column[];
  initialLimit?: number;
  loadMoreIncrement?: number;
}

/**
 * Generic, reusable table component for song statistics
 * Features:
 * - Flexible column configuration
 * - Load more functionality
 * - Client-side pagination
 */
export function SongStatsTable({
  title,
  songs,
  columns,
  initialLimit = 10,
  loadMoreIncrement = 10,
}: SongStatsTableProps) {
  const [visibleCount, setVisibleCount] = useState(initialLimit);

  const visibleSongs = songs.slice(0, visibleCount);
  const hasMore = visibleCount < songs.length;
  const remainingCount = songs.length - visibleCount;

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + loadMoreIncrement);
  };

  return (
    <section className="mb-16">
      <h2 className="text-2xl font-bold mb-4">{title}</h2>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b">
              <th className="text-left p-3">#</th>
              {columns.map((column, index) => (
                <th
                  key={index}
                  className={`p-3 ${
                    column.align === "right" ? "text-right" : "text-left"
                  }`}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visibleSongs.map((song, index) => (
              <tr key={song.id} className="border-b hover:bg-muted/50">
                <td className="p-3">{index + 1}</td>
                {columns.map((column, colIndex) => (
                  <td
                    key={colIndex}
                    className={`p-3 ${
                      column.align === "right" ? "text-right" : ""
                    } ${column.className || ""}`}
                  >
                    {column.accessor(song)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Load More Button */}
      {hasMore && (
        <div className="mt-6 text-center">
          <button
            onClick={handleLoadMore}
            className="px-6 py-2 border border-primary/50 hover:bg-primary/10 rounded transition-colors"
          >
            Load More ({remainingCount} remaining)
          </button>
        </div>
      )}
    </section>
  );
}
