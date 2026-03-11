import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

async function runCleanup() {
  try {
    const now = new Date();
    const nowIso = now.toISOString();
    const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000).toISOString();

    // Find expired rooms OR inactive rooms (no activity for 5 minutes)
    const { data: expiredRooms, error: fetchError } = await supabase
      .from("rooms")
      .select("id")
      .or(`expires_at.lt.${nowIso},and(last_activity.lt.${fiveMinutesAgo},last_activity.is.not.null)`);

    if (fetchError) {
      console.error("Fetch expired rooms error:", fetchError);
      return {
        success: false,
        error: "Failed to fetch expired rooms",
        deleted: 0,
      };
    }

    if (!expiredRooms || expiredRooms.length === 0) {
      return { success: true, deleted: 0, message: "No expired rooms found" };
    }

    let totalDeleted = 0;
    const errors: string[] = [];

    for (const room of expiredRooms) {
      try {
        // Get files for this room
        const { data: files, error: filesError } = await supabase
          .from("files")
          .select("file_path")
          .eq("room_id", room.id);

        if (filesError) {
          errors.push(`Failed to fetch files for room ${room.id}: ${filesError.message}`);
          continue;
        }

        // Delete from storage
        if (files && files.length > 0) {
          const paths = files.map((f) => f.file_path);
          const { error: storageError } = await supabase.storage
            .from("rooms-storage")
            .remove(paths);
          
          if (storageError) {
            console.warn(`Failed to delete files from storage for room ${room.id}:`, storageError);
          }
        }

        // Delete file records
        const { error: deleteFilesError } = await supabase
          .from("files")
          .delete()
          .eq("room_id", room.id);

        if (deleteFilesError) {
          errors.push(`Failed to delete file records for room ${room.id}: ${deleteFilesError.message}`);
          continue;
        }

        // Delete room
        const { error: deleteRoomError } = await supabase
          .from("rooms")
          .delete()
          .eq("id", room.id);

        if (deleteRoomError) {
          errors.push(`Failed to delete room ${room.id}: ${deleteRoomError.message}`);
          continue;
        }

        totalDeleted++;
        console.log(`Successfully cleaned up room ${room.id}`);
      } catch (err) {
        errors.push(`Unexpected error cleaning room ${room.id}: ${err instanceof Error ? err.message : String(err)}`);
      }
    }

    return {
      success: true,
      deleted: totalDeleted,
      total: expiredRooms.length,
      errors: errors.length > 0 ? errors : undefined,
    };
  } catch (err) {
    console.error("Cleanup error:", err);
    return {
      success: false,
      error: "Internal server error",
      deleted: 0,
    };
  }
}

// GET /api/cleanup — Cleanup handler for cron jobs
export async function GET() {
  const result = await runCleanup();
  return NextResponse.json(result);
}

// POST /api/cleanup — Manual cleanup trigger
export async function POST() {
  const result = await runCleanup();
  
  if (!result.success) {
    return NextResponse.json(result, { status: 500 });
  }
  
  return NextResponse.json(result);
}
