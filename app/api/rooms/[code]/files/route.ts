import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { isRoomExpired } from "@/lib/utils";
import { ALLOWED_FILE_TYPES, MAX_FILE_SIZE } from "@/lib/constants";

// GET /api/rooms/[code]/files — List files in a room
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await params;
    const { data: room } = await supabase
      .from("rooms")
      .select("*")
      .eq("room_code", code.toUpperCase())
      .single();

    if (!room) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 });
    }

    const { data: files, error } = await supabase
      .from("files")
      .select("*")
      .eq("room_id", room.id)
      .order("uploaded_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: "Failed to fetch files" }, { status: 500 });
    }

    // Generate signed URLs for each file
    const filesWithUrls = await Promise.all(
      (files || []).map(async (file) => {
        const { data } = await supabase.storage
          .from("rooms-storage")
          .createSignedUrl(file.file_path, 60 * 30); // 30 min signed url

        return {
          ...file,
          signed_url: data?.signedUrl || null,
        };
      })
    );

    return NextResponse.json(filesWithUrls);
  } catch (err) {
    console.error("List files error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST /api/rooms/[code]/files — Upload a file to a room
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await params;

    // Validate room
    const { data: room } = await supabase
      .from("rooms")
      .select("*")
      .eq("room_code", code.toUpperCase())
      .single();

    if (!room) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 });
    }

    if (isRoomExpired(room.expires_at)) {
      return NextResponse.json({ error: "Room has expired" }, { status: 410 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate file type
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "File type not allowed. Only images and PDFs accepted." },
        { status: 400 }
      );
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "File too large. Max 10MB." },
        { status: 400 }
      );
    }

    // Upload to Supabase Storage
    const timestamp = Date.now();
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const filePath = `rooms/${room.id}/${timestamp}_${safeName}`;

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const { error: uploadError } = await supabase.storage
      .from("rooms-storage")
      .upload(filePath, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      console.error("Upload error:", uploadError);
      return NextResponse.json(
        { error: "Failed to upload file" },
        { status: 500 }
      );
    }

    // Save metadata in DB
    const { data: fileRecord, error: dbError } = await supabase
      .from("files")
      .insert({
        room_id: room.id,
        file_name: file.name,
        file_path: filePath,
        uploaded_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (dbError) {
      console.error("DB error:", dbError);
      // Try to clean up the uploaded file
      await supabase.storage.from("rooms-storage").remove([filePath]);
      return NextResponse.json(
        { error: "Failed to save file metadata" },
        { status: 500 }
      );
    }

    // Generate signed URL
    const { data: signedUrlData } = await supabase.storage
      .from("rooms-storage")
      .createSignedUrl(filePath, 60 * 30);

    return NextResponse.json(
      {
        ...fileRecord,
        signed_url: signedUrlData?.signedUrl || null,
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("Upload file error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
