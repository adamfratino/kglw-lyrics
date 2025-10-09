"use client";

import { useQueryState, parseAsInteger } from "nuqs";
import type { SongStats } from "@/types/lyrics";
import { AnimatedBarChart } from "./AnimatedBarChart";

/**
 * Column configuration for flexible table rendering
 */
interface Column {
  header: string;
  accessor?: (song: SongStats) => string | number;
  /** Custom render function for complex column content */
  render?: (song: SongStats) => React.ReactNode;
  align?: "left" | "right";
  className?: string;
  /** If true, renders as an animated bar chart */
  isBarChart?: boolean;
}

interface SongStatsTableProps {
  title: string;
  songs: SongStats[];
  columns: Column[];
  initialLimit?: number;
  loadMoreIncrement?: number;
  queryParamKey: string;
}

/**
 * Generic, reusable table component for song statistics
 * Features:
 * - Flexible column configuration
 * - Load more functionality
 * - Client-side pagination
 * - URL-persisted state via query parameters
 */
export function SongStatsTable({
  title,
  songs,
  columns,
  initialLimit = 10,
  loadMoreIncrement = 10,
  queryParamKey,
}: SongStatsTableProps) {
  const [visibleCount, setVisibleCount] = useQueryState(
    queryParamKey,
    parseAsInteger.withDefault(initialLimit)
  );

  // Ensure visibleCount is always a valid number
  const currentLimit = visibleCount ?? initialLimit;

  const visibleSongs = songs.slice(0, currentLimit);
  const hasMore = currentLimit < songs.length;
  const remainingCount = songs.length - currentLimit;

  // Calculate max values for bar chart columns
  const maxValues = columns.map((column) => {
    if (!column.isBarChart || !column.accessor) return 0;
    const accessor = column.accessor;
    return Math.max(...songs.map((song) => Number(accessor(song)) || 0));
  });

  const handleLoadMore = () => {
    setVisibleCount(currentLimit + loadMoreIncrement);
  };

  return (
    <section className="mb-16 bg-black">
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
                    {column.render ? (
                      column.render(song)
                    ) : column.isBarChart && column.accessor ? (
                      <AnimatedBarChart
                        value={Number(column.accessor(song))}
                        maxValue={maxValues[colIndex]}
                        animationSpeed={20}
                      />
                    ) : column.accessor ? (
                      column.accessor(song)
                    ) : null}
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
