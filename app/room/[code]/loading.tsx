export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 -mt-16">
      <div className="relative">
        <div className="absolute inset-0 bg-[#6dd07d]/20 rounded-full blur-2xl animate-pulse" />
        <div className="relative w-16 h-16 border-[3px] border-[#6dd07d]/20 border-t-[#6dd07d] rounded-full animate-spin" />
      </div>
      <p className="mt-6 text-[#fefeff]/50 text-sm animate-pulse">Loading...</p>
    </div>
  );
}
