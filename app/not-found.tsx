import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 -mt-16">
      <div className="text-center space-y-4 max-w-md">
        <p className="text-6xl font-bold text-brand">404</p>
        <h1 className="text-2xl font-bold text-primary">Room Not Found</h1>
        <p className="text-primary/50">
          The room you&apos;re looking for doesn&apos;t exist or has expired.
        </p>
        <div className="flex gap-3 justify-center pt-4">
          <Link
            href="/create"
            className="px-6 py-3 bg-brand text-bg font-semibold rounded-lg hover:bg-brand-hover transition-all duration-200"
          >
            Create Room
          </Link>
          <Link
            href="/"
            className="px-6 py-3 bg-white/3 border border-white/6 text-primary font-semibold rounded-lg hover:bg-white/8 transition-all duration-200"
          >
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}
