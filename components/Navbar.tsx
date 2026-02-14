import Image from "next/image";
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#040204]/80 backdrop-blur-xl border-b border-white/[0.04]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="relative">
            <div className="absolute inset-0 bg-[#6dd07d]/20 rounded-full blur-lg group-hover:bg-[#6dd07d]/30 transition-all duration-300" />
            <Image
              src="/logo.png"
              alt="FastShare"
              width={32}
              height={32}
              className="relative"
              priority
            />
          </div>
          <span className="text-[#fefeff] font-bold text-lg hidden sm:block">
            FastShare
          </span>
        </Link>
        <div className="flex items-center gap-3">
          <Link
            href="/create"
            className="text-sm text-[#fefeff]/60 hover:text-[#6dd07d] transition-colors duration-200"
          >
            Create Room
          </Link>
          <Link
            href="/join"
            className="text-sm text-[#fefeff]/60 hover:text-[#6dd07d] transition-colors duration-200"
          >
            Join Room
          </Link>
        </div>
      </div>
    </nav>
  );
}
