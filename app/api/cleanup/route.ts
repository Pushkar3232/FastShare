import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// POST /api/cleanup — Clean up expired rooms
export async function POST() {
  try {
    const now = new Date().toISOString();

    // Find expired rooms
    const { data: expiredRooms, error: fetchError } = await supabase
      .from("rooms")
      .select("id")
      .lt("expires_at", now);

    if (fetchError) {
      console.error("Fetch expired rooms error:", fetchError);
      return NextResponse.json(
        { error: "Failed to fetch expired rooms" },
        { status: 500 }
      );
    }

    if (!expiredRooms || expiredRooms.length === 0) {
      return NextResponse.json({ deleted: 0 });
    }

    let totalDeleted = 0;

    for (const room of expiredRooms) {
      // Get files for this room
      const { data: files } = await supabase
        .from("files")
        .select("file_path")
        .eq("room_id", room.id);

      // Delete from storage
      if (files && files.length > 0) {
        const paths = files.map((f) => f.file_path);
        await supabase.storage.from("rooms-storage").remove(paths);
      }

      // Delete file records
      await supabase.from("files").delete().eq("room_id", room.id);

      // Delete room
      await supabase.from("rooms").delete().eq("id", room.id);

      totalDeleted++;
    }

    return NextResponse.json({ deleted: totalDeleted });
  } catch (err) {
    console.error("Cleanup error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
