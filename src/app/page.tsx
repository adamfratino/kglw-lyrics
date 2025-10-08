import { HeroTitle } from "@/components/HeroTitle";

export default function Home() {
  return (
    <main className="relative">
      {/* Hero section with scroll animation */}
      <div className="relative h-screen">
        <HeroTitle />
      </div>

      {/* Main content that triggers scrolling */}
      <div className="relative opacity-0">
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-4xl mx-auto space-y-8">
            <section className="bg-card p-8 rounded-lg border">
              <h2 className="text-3xl font-bold mb-4">Song Statistics</h2>
              <p className="text-muted-foreground">
                Scroll down to see the header shrink and stick to the top!
              </p>
            </section>

            <section className="bg-card p-8 rounded-lg border">
              <h2 className="text-2xl font-bold mb-4">Coming Soon</h2>
              <p className="text-muted-foreground mb-4">
                Fun statistics about King Gizzard lyrics will appear here.
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>Which song has the title mentioned most?</li>
                <li>Which song has the fewest unique words?</li>
                <li>Most common words across all songs</li>
                <li>Longest vs shortest songs</li>
              </ul>
            </section>

            {/* Add more placeholder content */}
            {[...Array(5)].map((_, i) => (
              <section key={i} className="bg-card p-8 rounded-lg border">
                <h3 className="text-xl font-bold mb-2">
                  Placeholder Section {i + 1}
                </h3>
                <p className="text-muted-foreground">
                  More content will go here. Keep scrolling to see the sticky
                  header effect!
                </p>
              </section>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
