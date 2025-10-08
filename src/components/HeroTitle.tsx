"use client";

import { useState } from "react";
import {
  useAsciiText,
  patorjksCheese,
  ansiShadow,
  bloody,
  deltaCorpsPriest1,
  dosRebel,
  amcNeko,
  defLeppard,
  georgia11,
  poison,
  sBlood,
} from "react-ascii-text";

const fonts = [
  ansiShadow,
  patorjksCheese,
  bloody,
  deltaCorpsPriest1,
  dosRebel,
  amcNeko,
  defLeppard,
  georgia11,
  poison,
  sBlood,
];

const AsciiDisplay = ({ font }: { font: any }) => {
  const asciiTextRef = useAsciiText({
    animationCharacters: "▒░█",
    animationCharacterSpacing: 1,
    animationDelay: 1000,
    animationDirection: "horizontal",
    animationInterval: 100,
    animationLoop: false,
    animationSpeed: 30,
    font: font,
    text: ["KGLW LYRICS"],
    fadeInOnly: true,
  });

  return <pre ref={asciiTextRef as any} className="text-white" />;
};

export const HeroTitle = () => {
  const [activeFont, setActiveFont] = useState(fonts[0]);

  const handleChangeFont = () => {
    const activeFont = fonts[Math.floor(Math.random() * fonts.length)];
    setActiveFont(activeFont);
  };

  return (
    <div className="flex flex-col justify-center items-center hero-scroll-animate">
      <button onClick={handleChangeFont} className="text-white">
        <AsciiDisplay font={activeFont} key={activeFont} />
      </button>
    </div>
  );
};
HeroTitle.displayName = "HeroTitle";
