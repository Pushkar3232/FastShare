import { supabase } from "@/lib/supabase";
import { isRoomExpired } from "@/lib/utils";
import { notFound } from "next/navigation";
import RoomClient from "./RoomClient";

interface RoomPageProps {
  params: Promise<{ code: string }>;
}

export default async function RoomPage({ params }: RoomPageProps) {
  const { code } = await params;

  // SSR: Fetch room data
  const { data: room, error } = await supabase
    .from("rooms")
    .select("*")
    .eq("room_code", code.toUpperCase())
    .single();

  if (error || !room) {
    notFound();
  }

  const expired = isRoomExpired(room.expires_at);

  // SSR: Fetch initial files
  const { data: files } = await supabase
    .from("files")
    .select("*")
    .eq("room_id", room.id)
    .order("uploaded_at", { ascending: false });

  // Generate signed URLs for initial files
  const filesWithUrls = await Promise.all(
    (files || []).map(async (file) => {
      const { data } = await supabase.storage
        .from("rooms-storage")
        .createSignedUrl(file.file_path, 60 * 30);
      return {
        ...file,
        signed_url: data?.signedUrl || null,
      };
    })
  );

  return (
    <RoomClient
      room={room}
      initialFiles={filesWithUrls}
      initialExpired={expired}
    />
  );
}
