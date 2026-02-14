import Image from "next/image";
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-bg/90 backdrop-blur-xl border-b border-white/4">
      <div className="max-w-6xl mx-auto px-3 sm:px-6 h-14 sm:h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="relative flex items-center">
            <div className="absolute inset-0 bg-brand/10 rounded-full blur-xl group-hover:bg-brand/20 transition-all duration-300" />
            <Image
              src="/logo-text.png"
              alt="FastShare"
              width={160}
              height={40}
              className="relative h-7 sm:h-9 w-auto object-contain"
              priority
            />
          </div>
        </Link>
        <div className="flex items-center gap-1 sm:gap-2">
          <Link
            href="/create"
            className="px-2.5 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-primary/70 hover:text-brand hover:bg-white/4 rounded-lg transition-all duration-200 touch-manipulation"
          >
            Create
          </Link>
          <Link
            href="/join"
            className="px-2.5 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-primary/70 hover:text-brand hover:bg-white/4 rounded-lg transition-all duration-200 touch-manipulation"
          >
            Join
          </Link>
        </div>
      </div>
    </nav>
  );
}
