import React, { ComponentPropsWithoutRef, CSSProperties } from "react";

import { cn } from "@/lib/utils";

interface RippleProps extends ComponentPropsWithoutRef<"div"> {
  mainCircleSize?: number;
  mainCircleOpacity?: number;
  numCircles?: number;
}

export const Ripple = React.memo(function Ripple({
  mainCircleSize = 300,
  mainCircleOpacity = 0.3,
  numCircles = 6,
  className,
  ...props
}: RippleProps) {
  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 select-none",
        className,
      )}
      {...props}
    >
      {Array.from({ length: numCircles }, (_, i) => {
        const size = mainCircleSize + i * 120;
        const opacity = mainCircleOpacity - i * 0.04;
        const animationDelay = `${i * 0.15}s`;
        const borderStyle = i === numCircles - 1 ? "dashed" : "solid";
        const borderOpacity = 10 + i * 8;

        return (
          <div
            key={i}
            className="absolute animate-ripple rounded-full shadow-lg"
            style={
              {
                width: `${size}px`,
                height: `${size}px`,
                opacity,
                animationDelay,
                borderStyle,
                borderWidth: "2px",
                borderColor: `rgba(0, 82, 255, ${borderOpacity / 100})`,
                backgroundColor: "rgba(0, 82, 255, 0.03)",
                boxShadow: "0 0 40px rgba(0, 82, 255, 0.1)",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%) scale(1)",
                animation: "ripple 4s cubic-bezier(0, 0, 0.2, 1) infinite",
              } as CSSProperties
            }
          />
        );
      })}
    </div>
  );
});

Ripple.displayName = "Ripple";
