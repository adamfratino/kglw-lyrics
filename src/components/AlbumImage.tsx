"use client";

import Image from "next/image";
import { useState } from "react";

interface AlbumImageProps {
  albumName: string;
  size?: number;
  className?: string;
  showTitle?: boolean;
}

/**
 * Converts album name to filename format
 * Example: "Nonagon Infinity" -> "nonagon-infinity.jpg"
 */
function albumNameToFilename(albumName: string): string {
  return `${albumName
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "") // Remove special characters except spaces and hyphens
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-")}.jpg`; // Replace multiple hyphens with single hyphen
}

/**
 * Album cover image component
 * - Displays album artwork from public folder
 * - Automatically converts album names to filename format
 * - Shows fallback on error
 */
export function AlbumImage({
  albumName,
  size = 48,
  className = "",
  showTitle = false,
}: AlbumImageProps) {
  const [hasError, setHasError] = useState(false);
  const filename = albumNameToFilename(albumName);

  // Fallback to text if image fails to load
  if (hasError) {
    return (
      <div
        className={`flex items-center justify-center bg-muted text-muted-foreground text-xs font-medium ${className}`}
        style={{ width: size, height: size }}
        title={albumName}
      >
        {albumName.slice(0, 2).toUpperCase()}
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Image
        src={`/${filename}`}
        alt={albumName}
        width={size}
        height={size}
        className="rounded object-cover"
        title={albumName}
        onError={() => setHasError(true)}
      />
      {showTitle && (
        <span className="text-sm text-muted-foreground">{albumName}</span>
      )}
    </div>
  );
}
