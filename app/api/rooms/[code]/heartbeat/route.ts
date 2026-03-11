import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// POST /api/rooms/[code]/heartbeat — User activity heartbeat
export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await params;

    // Get room
    const { data: room, error: roomError } = await supabase
      .from("rooms")
      .select("id, last_activity")
      .eq("room_code", code.toUpperCase())
      .single();

    if (roomError || !room) {
      return NextResponse.json(
        { error: "Room not found" },
        { status: 404 }
      );
    }

    // Update last activity timestamp
    const now = new Date().toISOString();
    const { error: updateError } = await supabase
      .from("rooms")
      .update({ last_activity: now })
      .eq("id", room.id);

    if (updateError) {
      console.error("Failed to update activity:", updateError);
      return NextResponse.json(
        { error: "Failed to update activity" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, timestamp: now });
  } catch (err) {
    console.error("Heartbeat error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
