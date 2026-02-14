import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  glow?: boolean;
}

export default function Card({ children, className = "", glow = false }: CardProps) {
  return (
    <div
      className={`bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6 ${
        glow ? "shadow-[0_0_40px_rgba(109,208,125,0.08)]" : ""
      } ${className}`}
    >
      {children}
    </div>
  );
}
