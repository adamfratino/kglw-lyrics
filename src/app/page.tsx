import { HeroTitle } from "@/components/HeroTitle";

export default function Home() {
  return (
    <main className="relative">
      {/* Hero section with scroll animation */}
      <div className="relative h-screen">
        <HeroTitle />
      </div>

      {/* Main content that triggers scrolling */}
      <div className="relative opacity-0 min-h-[200dvh]" />
    </main>
  );
}
