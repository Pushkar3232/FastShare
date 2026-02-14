export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 bg-[#040204] flex flex-col items-center justify-center gap-6 z-50">
      <div className="relative">
        <div className="absolute inset-0 bg-[#6dd07d]/20 rounded-full blur-2xl animate-pulse" />
        <div className="relative w-16 h-16 border-3 border-[#6dd07d]/20 border-t-[#6dd07d] rounded-full animate-spin" />
      </div>
      <p className="text-[#fefeff]/60 text-sm animate-pulse">Loading...</p>
    </div>
  );
}
