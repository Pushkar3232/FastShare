import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  glow?: boolean;
}

export default function Card({ children, className = "", glow = false }: CardProps) {
  return (
    <div
      className={`bg-white/3 border border-white/6 rounded-2xl p-6 ${
        glow ? "shadow-[0_0_40px_rgba(109,208,125,0.08)]" : ""
      } ${className}`}
    >
      {children}
    </div>
  );
}
