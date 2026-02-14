"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
    <div className="flex flex-col items-center justify-center min-h-screen px-4 -mt-16">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-[#6dd07d]/[0.04] rounded-full blur-[100px] pointer-events-none" />

      <Card glow className="relative w-full max-w-md text-center space-y-6 p-8">
        <div className="space-y-2">
          <div className="w-14 h-14 mx-auto rounded-xl bg-[#6dd07d]/10 flex items-center justify-center mb-4">
            <svg className="w-7 h-7 text-[#6dd07d]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-[#fefeff]">Create a Room</h1>
          <p className="text-[#fefeff]/50 text-sm">
            Your room will expire after {ROOM_EXPIRY_MINUTES} minutes.
            <br />
            Share the code with friends to start sharing files.
          </p>
        </div>

        <Button
          onClick={handleCreate}
          loading={loading}
          size="lg"
          className="w-full"
        >
          Create Room
        </Button>

        {error && (
          <p className="text-red-400 text-sm">{error}</p>
        )}

        <p className="text-[#fefeff]/30 text-xs">
          No account needed. Files are deleted after room expires.
        </p>
      </Card>
    </div>
  );
}
