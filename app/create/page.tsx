"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { IconPlus, IconInfoCircle } from "@tabler/icons-react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { ROOM_EXPIRY_MINUTES } from "@/lib/constants";

export default function CreateRoomPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreate = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/rooms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create room");
      router.push(`/room/${data.room_code}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-3 sm:px-4 pt-6 sm:pt-8">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-125 h-125 bg-brand/4 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-20 right-1/4 w-65 h-65 rounded-full bg-brand/3 blur-[100px] pointer-events-none" />

      <Card glow className="relative w-full max-w-lg space-y-6 sm:space-y-8 p-6 sm:p-10 md:p-12">
        <div className="space-y-3 sm:space-y-4 text-center">
          <span className="inline-flex rounded-full border border-brand/25 bg-brand/10 px-2.5 sm:px-3 py-1 text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.15em] sm:tracking-[0.18em] text-brand">
            New session
          </span>
          <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto rounded-2xl bg-linear-to-br from-brand/20 to-brand/5 flex items-center justify-center shadow-lg shadow-brand/10">
            <IconPlus className="w-7 h-7 sm:w-8 sm:h-8 text-brand" stroke={2} />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-primary">Create a Room</h1>
          <p className="text-primary/50 text-sm sm:text-base leading-relaxed px-2">
            Your room will expire after {ROOM_EXPIRY_MINUTES} minutes.
            <br />
            Share the code with friends to start sharing files.
          </p>
        </div>

        <Button
          onClick={handleCreate}
          loading={loading}
          size="lg"
          className="w-full text-base py-4 touch-manipulation"
        >
          Create Room
        </Button>

        <div className="rounded-xl border border-white/6 bg-white/2 px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm text-primary/45">
          Anyone with your room code can join instantly. All uploads are removed automatically after expiry.
        </div>

        {error && (
          <div className="flex items-center justify-center gap-2 text-red-400 text-xs sm:text-sm">
            <IconInfoCircle className="w-4 h-4" />
            {error}
          </div>
        )}

        <p className="text-primary/30 text-xs sm:text-sm">
          No account needed. Files are deleted after room expires.
        </p>
      </Card>
    </div>
  );
}
