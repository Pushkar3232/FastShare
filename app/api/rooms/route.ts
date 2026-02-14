import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { generateRoomCode } from "@/lib/utils";
import { ROOM_EXPIRY_MINUTES } from "@/lib/constants";

// POST /api/rooms — Create a new room
export async function POST() {
  try {
    let roomCode = generateRoomCode();
    let attempts = 0;

    // Ensure unique code
    while (attempts < 10) {
      const { data: existing } = await supabase
        .from("rooms")
        .select("id")
        .eq("room_code", roomCode)
        .single();

      if (!existing) break;
      roomCode = generateRoomCode();
      attempts++;
    }

    const now = new Date();
    const expiresAt = new Date(now.getTime() + ROOM_EXPIRY_MINUTES * 60 * 1000);

    const { data, error } = await supabase
      .from("rooms")
      .insert({
        room_code: roomCode,
        created_at: now.toISOString(),
        expires_at: expiresAt.toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json(
        { error: "Failed to create room" },
        { status: 500 }
      );
    }

    return NextResponse.json(data, { status: 201 });
  } catch (err) {
    console.error("Create room error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
