import Link from "next/link";
import Image from "next/image";
import {
  IconPlus,
  IconLogin,
  IconBolt,
  IconLock,
  IconClock,
} from "@tabler/icons-react";

export default function Home() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-3 sm:px-4">
      {/* Background effects - reduced intensity */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#6dd07d]/[0.02] rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] bg-[#6dd07d]/[0.015] rounded-full blur-[120px] pointer-events-none" />

      <div className="relative w-full px-3 py-6 sm:px-4 sm:py-8">
        <div className="flex w-full flex-col items-center gap-4 sm:gap-6 text-center">
          <span className="rounded-full border border-[#6dd07d]/20 bg-[#6dd07d]/5 px-3 py-1.5 text-[10px] sm:text-xs font-semibold uppercase tracking-[0.15em] sm:tracking-[0.2em] text-[#6dd07d]/80">
            Privacy-first file sharing
          </span>

          <div className="relative">
            <div className="absolute inset-0 bg-[#6dd07d]/8 rounded-full blur-2xl scale-125" />
            <Image
              src="/logo-text.png"
              alt="FastShare"
              width={280}
              height={78}
              className="relative h-auto w-[140px] sm:w-[180px] md:w-[220px] object-contain opacity-95"
              priority
            />
          </div>

          <div className="space-y-3 sm:space-y-4 mt-1 sm:mt-2">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight text-[#fefeff] leading-tight px-2">
              Share files instantly
            </h1>
            <p className="mx-auto max-w-2xl text-base sm:text-lg md:text-xl leading-relaxed text-[#fefeff]/70 px-2">
              Create a room, share the code, and transfer files securely.
              <span className="block mt-1 text-sm sm:text-base text-[#fefeff]/50">No sign-up required. Files auto-delete after expiry.</span>
            </p>
          </div>

          <div className="flex w-full max-w-md flex-col gap-3 sm:flex-row mt-2 sm:mt-4 px-2">
            <Link
              href="/create"
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#6dd07d] px-6 sm:px-8 py-3.5 sm:py-4 text-sm sm:text-base font-semibold text-[#040204] transition-all duration-200 hover:scale-[1.02] hover:bg-[#7eda8d] hover:shadow-[0_0_40px_rgba(109,208,125,0.3)] active:scale-[0.98] shadow-[0_0_20px_rgba(109,208,125,0.15)] touch-manipulation"
            >
              <IconPlus className="h-4 w-4 sm:h-5 sm:w-5" stroke={2.5} />
              Create Room
            </Link>
            <Link
              href="/join"
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border-2 border-[#6dd07d]/30 bg-[#6dd07d]/5 px-6 sm:px-8 py-3.5 sm:py-4 text-sm sm:text-base font-semibold text-[#fefeff] transition-all duration-200 hover:scale-[1.02] hover:border-[#6dd07d]/50 hover:bg-[#6dd07d]/10 hover:shadow-[0_0_20px_rgba(109,208,125,0.15)] active:scale-[0.98] touch-manipulation"
            >
              <IconLogin className="h-4 w-4 sm:h-5 sm:w-5" stroke={2} />
              Join Room
            </Link>
          </div>

          <div className="grid w-full max-w-2xl grid-cols-1 gap-3 pt-3 sm:pt-4 sm:grid-cols-3 px-2">
            {[
              {
                icon: IconBolt,
                label: "Instant",
                desc: "Start sharing in seconds",
                color: "text-yellow-400",
              },
              {
                icon: IconLock,
                label: "Secure",
                desc: "Private links, temporary rooms",
                color: "text-blue-400",
              },
              {
                icon: IconClock,
                label: "Auto-Delete",
                desc: "Files removed after expiry",
                color: "text-purple-400",
              },
            ].map((feature) => (
              <div
                key={feature.label}
                className="group rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4 sm:p-5 text-left transition-all duration-300 hover:border-[#6dd07d]/30 hover:bg-white/[0.06] hover:shadow-lg hover:shadow-[#6dd07d]/5 hover:-translate-y-1 cursor-default touch-manipulation"
              >
                <feature.icon className={`mb-2 sm:mb-3 h-5 w-5 sm:h-6 sm:w-6 ${feature.color} transition-transform duration-300 group-hover:scale-110`} stroke={2} />
                <p className="text-xs sm:text-sm font-semibold uppercase tracking-wide text-[#fefeff]">
                  {feature.label}
                </p>
                <p className="mt-1 sm:mt-1.5 text-[11px] sm:text-xs text-[#fefeff]/65 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
