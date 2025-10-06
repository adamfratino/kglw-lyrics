"""
Scrape King Gizzard & the Lizard Wizard lyrics using LyricsGenius.
Saves results to a simple JSON file with error handling and progress saving.
"""

import json
import os
import time
from datetime import datetime
from lyricsgenius import Genius
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configuration
GENIUS_ACCESS_TOKEN = os.getenv('GENIUS_ACCESS_TOKEN')
if not GENIUS_ACCESS_TOKEN:
    print("❌ Error: GENIUS_ACCESS_TOKEN not found in .env file")
    print("Please create a .env file with your token")
    exit(1)

ARTIST_NAME = "King Gizzard & the Lizard Wizard"
OUTPUT_FILE = "data/lyrics.json"
TEMP_FILE = "data/lyrics_temp.json"

def save_progress(songs_data, is_final=False):
    """Save current progress to file."""
    filename = OUTPUT_FILE if is_final else TEMP_FILE
    os.makedirs(os.path.dirname(filename), exist_ok=True)
    with open(filename, 'w', encoding='utf-8') as f:
        json.dump(songs_data, f, indent=2, ensure_ascii=False)

def safe_get_attr(obj, attr, default=None):
    """Safely get attribute from object, returning default if not found."""
    try:
        return getattr(obj, attr, default)
    except:
        return default

def main():
    """Scrape all songs from the artist and save to JSON."""
    print(f"🎸 Scraping {ARTIST_NAME} lyrics from Genius...")
    print(f"⏰ Started at: {datetime.now().strftime('%I:%M:%S %p')}\n")
    
    # Initialize Genius client with longer timeout and retry settings
    print("Initializing Genius API client with robust settings...")
    genius = Genius(
        GENIUS_ACCESS_TOKEN,
        skip_non_songs=True,
        remove_section_headers=True,
        verbose=True,  # Show API calls and progress
        timeout=15,  # Longer timeout (default is 5)
        retries=3,  # Retry failed requests
    )
    
    print(f"\n🔍 Searching for all songs by {ARTIST_NAME}...")
    print("This will take several minutes. Progress will be saved as we go.\n")
    print("-" * 60)
    
    songs_data = []
    skipped_songs = []
    
    try:
        # Get all songs (set max_songs=10 for testing, None for everything)
        artist = genius.search_artist(
            ARTIST_NAME,
            max_songs=None,  # Change to 10 for quick testing
            sort="popularity",
        )
        
        if not artist:
            print(f"\n❌ Could not find artist: {ARTIST_NAME}")
            return
        
        print("-" * 60)
        print(f"\n✅ Found {len(artist.songs)} songs!\n")
        
        # Debug: Show structure of first song
        if len(artist.songs) > 0:
            first_song = artist.songs[0]
            print(f"🔍 DEBUG - First song structure:")
            print(f"   Type: {type(first_song)}")
            print(f"   Available as dict keys: {first_song.to_dict().keys() if hasattr(first_song, 'to_dict') else 'N/A'}")
            print(f"   Title: {safe_get_attr(first_song, 'title', 'N/A')}")
            print(f"   Has lyrics: {bool(safe_get_attr(first_song, 'lyrics', None))}")
            print()
        
        print("📝 Processing songs into JSON format...\n")
        
        # Process each song with error handling
        for idx, song in enumerate(artist.songs, 1):
            try:
                # Get song data - use to_dict() if available, otherwise manual extraction
                if hasattr(song, 'to_dict'):
                    song_dict = song.to_dict()
                    song_data = {
                        "id": song_dict.get('id') or song_dict.get('song_id') or idx,
                        "title": song_dict.get('title', 'Unknown'),
                        "artist": song_dict.get('artist', ARTIST_NAME),
                        "album": song_dict.get('album'),
                        "year": song_dict.get('year'),
                        "lyrics": song_dict.get('lyrics', ''),
                        "url": song_dict.get('url', ''),
                    }
                else:
                    # Fallback to attribute access
                    song_data = {
                        "id": idx,  # Use index as fallback ID
                        "title": safe_get_attr(song, 'title', 'Unknown'),
                        "artist": safe_get_attr(song, 'artist', ARTIST_NAME),
                        "album": safe_get_attr(song, 'album'),
                        "year": safe_get_attr(song, 'year'),
                        "lyrics": safe_get_attr(song, 'lyrics', ''),
                        "url": safe_get_attr(song, 'url', ''),
                    }
                
                # Check if lyrics exist
                if not song_data['lyrics'] or len(song_data['lyrics'].strip()) < 10:
                    print(f"  [{idx}/{len(artist.songs)}] ⚠️  {song_data['title']} (no lyrics)")
                    skipped_songs.append(song_data['title'])
                    continue
                
                songs_data.append(song_data)
                print(f"  [{idx}/{len(artist.songs)}] ✓ {song_data['title']}")
                
                # Save progress every 10 songs
                if idx % 10 == 0:
                    save_progress(songs_data, is_final=False)
                    print(f"     💾 Progress saved ({len(songs_data)} songs so far)")
                
            except Exception as e:
                print(f"  [{idx}/{len(artist.songs)}] ❌ Error processing song: {str(e)}")
                print(f"     Song title: {safe_get_attr(song, 'title', 'Unknown')}")
                skipped_songs.append(safe_get_attr(song, 'title', f'Song #{idx}'))
                time.sleep(0.5)  # Brief pause before continuing
                continue
    
    except KeyboardInterrupt:
        print(f"\n\n⚠️  Interrupted by user!")
        print(f"Saving {len(songs_data)} songs collected so far...")
        save_progress(songs_data, is_final=True)
        print(f"✅ Saved to {OUTPUT_FILE}")
        return
    
    except Exception as e:
        print(f"\n\n❌ Unexpected error: {str(e)}")
        print(f"Full error details: {repr(e)}")
        print(f"Saving {len(songs_data)} songs collected so far...")
        if len(songs_data) > 0:
            save_progress(songs_data, is_final=True)
            print(f"✅ Saved to {OUTPUT_FILE}")
        return
    
    # Final save
    print(f"\n💾 Saving final results to {OUTPUT_FILE}...")
    save_progress(songs_data, is_final=True)
    
    # Clean up temp file
    if os.path.exists(TEMP_FILE):
        os.remove(TEMP_FILE)
    
    # Summary
    print(f"\n{'='*60}")
    print(f"✅ Successfully saved {len(songs_data)} songs!")
    if skipped_songs:
        print(f"⚠️  Skipped {len(skipped_songs)} songs (errors or no lyrics)")
        if len(skipped_songs) <= 10:
            for song in skipped_songs:
                print(f"   - {song}")
        else:
            print(f"   (First 10: {', '.join(skipped_songs[:10])})")
    print(f"⏰ Finished at: {datetime.now().strftime('%I:%M:%S %p')}")
    print(f"{'='*60}")
    print(f"\n🎉 Data saved to: {OUTPUT_FILE}")
    print(f"📊 Ready to import into your Next.js app!")

if __name__ == "__main__":
    main()
