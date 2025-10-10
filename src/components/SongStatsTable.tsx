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
  /** Custom formatter for bar chart values */
  formatValue?: (value: number) => string;
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
    <section className="mb-16 bg-black" role="region" aria-label={title}>
      <h2 className="text-2xl font-bold mb-6">{title}</h2>

      <div className="space-y-4" role="list">
        {visibleSongs.map((song, index) => {
          // Find the columns we need
          const titleColumn = columns.find((col) => col.header === "Song");
          const albumColumn = columns.find((col) => col.header === "Album");
          const barChartColumn = columns.find((col) => col.isBarChart);
          const statsColumns = columns.filter(
            (col) =>
              !col.isBarChart && col.header !== "Song" && col.header !== "Album"
          );

          return (
            <article
              key={song.id}
              className="border border-primary/20 rounded-lg p-6 hover:border-primary/40 transition-colors min-h-[160px]"
              role="listitem"
            >
              {/* Top Row: Rank, Title, Album */}
              <div className="flex items-center">
                <div className="text-xl font-bold min-w-[2.5rem]">
                  #{index + 1}
                </div>
                <div className="flex-1 flex items-center gap-4">
                  {titleColumn?.accessor && (
                    <h3 className="text-3xl font-semibold font-mono">
                      {titleColumn.accessor(song)}
                    </h3>
                  )}
                  <div className="ml-auto">
                    {albumColumn?.render && albumColumn.render(song)}
                  </div>
                </div>
              </div>

              {/* Bottom Row: Bar Chart (left) + Stats (right) */}
              <div className="grid grid-cols-1 items-center">
                {/* Bar Chart Section */}
                {barChartColumn && (
                  <div className="min-h-[60px] flex items-center">
                    {barChartColumn.accessor ? (
                      <div className="w-full">
                        <AnimatedBarChart
                          value={Number(barChartColumn.accessor(song))}
                          maxValue={maxValues[columns.indexOf(barChartColumn)]}
                          animationSpeed={20}
                          formatValue={barChartColumn.formatValue}
                        />
                      </div>
                    ) : null}
                  </div>
                )}

                {/* Stats Section */}
                {statsColumns.length > 0 && (
                  <div className="flex gap-2">
                    {statsColumns.map((column, colIndex) => (
                      <div key={colIndex} className="text-right">
                        <div className="text-lg font-mono font-semibold">
                          of{" "}
                          {column.render
                            ? column.render(song)
                            : column.accessor
                            ? column.accessor(song)
                            : null}{" "}
                          words
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </article>
          );
        })}
      </div>

      {/* Load More Button */}
      {hasMore && (
        <div className="mt-8 text-center">
          <button
            onClick={handleLoadMore}
            className="px-8 py-3 border border-primary/50 hover:bg-primary/10 rounded-lg transition-colors font-medium"
          >
            Load More ({remainingCount} remaining)
          </button>
        </div>
      )}
    </section>
  );
}
