import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 -mt-16">
      {/* Hero glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#6dd07d]/[0.06] rounded-full blur-[120px] pointer-events-none" />

      <div className="relative flex flex-col items-center gap-8 text-center max-w-lg">
        {/* Logo */}
        <div className="relative">
          <div className="absolute inset-0 bg-[#6dd07d]/20 rounded-full blur-2xl" />
          <Image
            src="/logo.png"
            alt="FastShare"
            width={80}
            height={80}
            className="relative drop-shadow-[0_0_30px_rgba(109,208,125,0.3)]"
            priority
          />
        </div>

        {/* Title */}
        <div className="space-y-3">
          <h1 className="text-4xl md:text-5xl font-bold text-[#fefeff] tracking-tight">
            Fast<span className="text-[#6dd07d]">Share</span>
          </h1>
          <p className="text-[#fefeff]/50 text-lg max-w-sm mx-auto leading-relaxed">
            Temporary file sharing for college labs. No login. No hassle.
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-xs">
          <Link
            href="/create"
            className="flex-1 inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#6dd07d] text-[#040204] font-semibold text-lg rounded-lg hover:bg-[#7eda8d] hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Create Room
          </Link>
          <Link
            href="/join"
            className="flex-1 inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/[0.03] border border-white/[0.06] text-[#fefeff] font-semibold text-lg rounded-lg hover:bg-white/[0.08] hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
            </svg>
            Join Room
          </Link>
        </div>

        {/* Features */}
        <div className="grid grid-cols-3 gap-6 mt-8 w-full max-w-md">
          {[
            { icon: "⚡", label: "Instant" },
            { icon: "🔒", label: "Secure" },
            { icon: "⏳", label: "Auto-Delete" },
          ].map((f) => (
            <div key={f.label} className="flex flex-col items-center gap-2">
              <span className="text-2xl">{f.icon}</span>
              <span className="text-xs text-[#fefeff]/40 uppercase tracking-wider">
                {f.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
