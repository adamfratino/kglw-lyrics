import { HeroTitle } from "@/sections";

export default function Home() {
  return (
    <main className="relative">
      {/* Hero section with scroll animation */}
      <div className="relative h-screen">
        <HeroTitle />
      </div>

      {/* Main content that triggers scrolling */}
      <div className="relative min-h-screen max-w-lg mx-auto bg-red-500 flex flex-col justify-center items-center">
        <h1 className="text-4xl font-bold">Hello</h1>
      </div>
    </main>
  );
}
