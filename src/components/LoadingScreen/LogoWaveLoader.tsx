"use client";
import React, { useEffect, useState } from "react";
import logoSVG from "@/assets/sir.richqrd-svg-logo.svg"; // replace with your logo path

export const LogoWaveLoader: React.FC<{ duration?: number; onFinish?: () => void }> = ({
  duration = 3000,
  onFinish,
}) => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoaded(true);
      onFinish?.();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onFinish]);

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center bg-gray-50 z-50 transition-opacity duration-500 ${
        loaded ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      <div className="relative w-48 h-48">
        <svg viewBox="0 0 200 200" className="w-full h-full">
          <defs>
            {/* Mask: only show black rect inside the logo */}
            <mask id="logoMask">
              {/* White logo defines the shape */}
              <image
                href={logoSVG}
                width="200"
                height="200"
                preserveAspectRatio="xMidYMid meet"
              />
            </mask>
          </defs>

          {/* Background (your logo shape will cut into this) */}
          <rect
            x="0"
            y="200"
            width="200"
            height="200"
            fill="black"
            mask="url(#logoMask)"
            className="wave-rect"
          />
        </svg>
      </div>

      <style>{`
        .wave-rect {
          animation: fillWave ${duration}ms forwards;
        }

        @keyframes fillWave {
          0% {
            y: 200;
          }
          100% {
            y: 0;
          }
        }
      `}</style>
    </div>
  );
};
