import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 -mt-16">
      <div className="text-center space-y-4 max-w-md">
        <p className="text-6xl font-bold text-[#6dd07d]">404</p>
        <h1 className="text-2xl font-bold text-[#fefeff]">Room Not Found</h1>
        <p className="text-[#fefeff]/50">
          The room you&apos;re looking for doesn&apos;t exist or has expired.
        </p>
        <div className="flex gap-3 justify-center pt-4">
          <Link
            href="/create"
            className="px-6 py-3 bg-[#6dd07d] text-[#040204] font-semibold rounded-lg hover:bg-[#7eda8d] transition-all duration-200"
          >
            Create Room
          </Link>
          <Link
            href="/"
            className="px-6 py-3 bg-white/[0.03] border border-white/[0.06] text-[#fefeff] font-semibold rounded-lg hover:bg-white/[0.08] transition-all duration-200"
          >
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}
