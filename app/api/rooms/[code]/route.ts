import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { isRoomExpired } from "@/lib/utils";

// GET /api/rooms/[code] — Get room details
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await params;
    const { data: room, error } = await supabase
      .from("rooms")
      .select("*")
      .eq("room_code", code.toUpperCase())
      .single();

    if (error || !room) {
      return NextResponse.json(
        { error: "Room not found" },
        { status: 404 }
      );
    }

    if (isRoomExpired(room.expires_at)) {
      return NextResponse.json(
        { error: "Room has expired" },
        { status: 410 }
      );
    }

    return NextResponse.json(room);
  } catch (err) {
    console.error("Get room error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE /api/rooms/[code] — End a room session
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await params;
    const { data: room } = await supabase
      .from("rooms")
      .select("id")
      .eq("room_code", code.toUpperCase())
      .single();

    if (!room) {
      return NextResponse.json(
        { error: "Room not found" },
        { status: 404 }
      );
    }

    // Delete files from storage
    const { data: files } = await supabase
      .from("files")
      .select("file_path")
      .eq("room_id", room.id);

    if (files && files.length > 0) {
      const paths = files.map((f) => f.file_path);
      await supabase.storage.from("rooms-storage").remove(paths);
    }

    // Delete file records
    await supabase.from("files").delete().eq("room_id", room.id);

    // Delete room
    await supabase.from("rooms").delete().eq("id", room.id);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Delete room error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
