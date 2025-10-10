"use client";

import { useEffect, useRef, useState } from "react";

interface AnimatedBarChartProps {
  value: number;
  maxValue: number;
  label?: string;
  animationSpeed?: number;
  className?: string;
  /** Custom formatter for displaying the value */
  formatValue?: (value: number) => string;
}

const ANIMATION_CHARS = ["░", "▒", "█"];
const BAR_LENGTH = 40; // Number of characters for full bar

/**
 * Animated horizontal bar chart component
 * - Animates in from left to right when scrolled into view
 * - Uses ASCII-style characters for visual effect
 * - Fades in the value after bar animation completes
 */
export function AnimatedBarChart({
  value,
  maxValue,
  label,
  animationSpeed = 150,
  className = "",
  formatValue,
}: AnimatedBarChartProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [animationProgress, setAnimationProgress] = useState(0);
  const [showValue, setShowValue] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Calculate the target bar length based on value/maxValue ratio
  const targetLength = Math.round((value / maxValue) * BAR_LENGTH);

  // Intersection Observer to detect when element is scrolled into view
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // Trigger when 80% of the element is visible (closer to middle of viewport)
          if (entry.isIntersecting && entry.intersectionRatio >= 0.8) {
            setIsVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: [0, 0.2, 0.4, 0.6, 0.8, 1.0],
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, []);

  // Animate the bar progress
  useEffect(() => {
    if (!isVisible) return;

    let currentProgress = 0;
    const increment = 1;

    const interval = setInterval(() => {
      currentProgress += increment;

      if (currentProgress >= targetLength) {
        setAnimationProgress(targetLength);
        clearInterval(interval);
        // Fade in value after bar completes
        setTimeout(() => setShowValue(true), 100);
      } else {
        setAnimationProgress(currentProgress);
      }
    }, animationSpeed);

    return () => clearInterval(interval);
  }, [isVisible, targetLength, animationSpeed]);

  // Generate the bar string with animation characters
  const generateBar = () => {
    if (!isVisible || animationProgress === 0) {
      return "";
    }

    const bars: string[] = [];

    for (let i = 0; i < animationProgress; i++) {
      // Use different characters for visual depth
      if (i === animationProgress - 1 && animationProgress < targetLength) {
        // Leading edge during animation
        bars.push(ANIMATION_CHARS[0]);
      } else if (
        i === animationProgress - 2 &&
        animationProgress < targetLength
      ) {
        bars.push(ANIMATION_CHARS[1]);
      } else {
        bars.push(ANIMATION_CHARS[2]);
      }
    }

    return bars.join("");
  };

  const isAnimating = isVisible && animationProgress < targetLength;

  return (
    <div
      ref={containerRef}
      className={`flex items-center gap-3 font-mono ${className}`}
    >
      {label && <span className="text-sm min-w-fit">{label}</span>}
      <div className="flex-1 flex items-center gap-4">
        <div className="relative">
          <pre className="text-[clamp(0.25rem,3cqw,2rem)] leading-none text-white">
            {generateBar()}
            {isAnimating && (
              <span className="animate-pulse opacity-50">
                {ANIMATION_CHARS[0]}
              </span>
            )}
          </pre>
        </div>
        <span
          className={`text-3xl mt-2 font-bold min-w-[3rem] transition-opacity duration-500 ${
            showValue ? "opacity-100" : "opacity-0"
          }`}
        >
          {formatValue ? formatValue(value) : value}
        </span>
      </div>
    </div>
  );
}
