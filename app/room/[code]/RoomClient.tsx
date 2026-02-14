"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { QRCodeSVG } from "qrcode.react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import CountdownTimer from "@/components/ui/CountdownTimer";
import UploadArea from "@/components/ui/UploadArea";
import RoomCodeDisplay from "@/components/ui/RoomCodeDisplay";
import { formatFileSize } from "@/lib/utils";

interface FileRecord {
  id: string;
  room_id: string;
  file_name: string;
  file_path: string;
  uploaded_at: string;
  signed_url: string | null;
}

interface Room {
  id: string;
  room_code: string;
  created_at: string;
  expires_at: string;
}

interface RoomClientProps {
  room: Room;
  initialFiles: FileRecord[];
  initialExpired: boolean;
}

export default function RoomClient({
  room,
  initialFiles,
  initialExpired,
}: RoomClientProps) {
  const router = useRouter();
  const [files, setFiles] = useState<FileRecord[]>(initialFiles);
  const [uploading, setUploading] = useState(false);
  const [expired, setExpired] = useState(initialExpired);
  const [showQR, setShowQR] = useState(false);
  const [ending, setEnding] = useState(false);

  // Poll for new files every 5 seconds
  useEffect(() => {
    if (expired) return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/rooms/${room.room_code}/files`);
        if (res.ok) {
          const data = await res.json();
          setFiles(data);
        }
      } catch {
        // Silently fail polling
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [room.room_code, expired]);

  const handleFileSelect = useCallback(
    async (file: File) => {
      if (expired) return;
      setUploading(true);
      try {
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch(`/api/rooms/${room.room_code}/files`, {
          method: "POST",
          body: formData,
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "Upload failed");
        }

        const newFile = await res.json();
        setFiles((prev) => [newFile, ...prev]);
      } catch (err) {
        alert(err instanceof Error ? err.message : "Upload failed");
      } finally {
        setUploading(false);
      }
    },
    [room.room_code, expired]
  );

  const handleEndSession = async () => {
    if (!confirm("End this session? All files will be permanently deleted.")) return;
    setEnding(true);
    try {
      await fetch(`/api/rooms/${room.room_code}`, { method: "DELETE" });
      router.push("/");
    } catch {
      setEnding(false);
    }
  };

  const handleExpired = useCallback(() => {
    setExpired(true);
  }, []);

  const roomUrl = typeof window !== "undefined"
    ? `${window.location.origin}/room/${room.room_code}`
    : "";

  const getFileIcon = (name: string) => {
    const ext = name.split(".").pop()?.toLowerCase();
    if (ext === "pdf") {
      return (
        <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      );
    }
    return (
      <svg className="w-5 h-5 text-[#6dd07d]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    );
  };

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header area */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <RoomCodeDisplay code={room.room_code} />
          <CountdownTimer expiresAt={room.expires_at} onExpired={handleExpired} />
        </div>

        {/* Actions bar */}
        <div className="flex flex-wrap gap-3 justify-center">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setShowQR(!showQR)}
          >
            {showQR ? "Hide" : "Show"} QR Code
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={handleEndSession}
            loading={ending}
          >
            End Session
          </Button>
        </div>

        {/* QR Code */}
        {showQR && roomUrl && (
          <Card className="flex justify-center py-6">
            <div className="bg-white p-4 rounded-xl">
              <QRCodeSVG value={roomUrl} size={180} />
            </div>
          </Card>
        )}

        {/* Expired Banner */}
        {expired && (
          <Card className="text-center py-6 border-red-500/30">
            <div className="space-y-2">
              <p className="text-red-400 font-semibold text-lg">Room Expired</p>
              <p className="text-[#fefeff]/50 text-sm">
                This room has expired. Files will be cleaned up shortly.
              </p>
              <Button variant="primary" onClick={() => router.push("/create")} className="mt-4">
                Create New Room
              </Button>
            </div>
          </Card>
        )}

        {/* Upload area */}
        {!expired && (
          <UploadArea
            onFileSelect={handleFileSelect}
            uploading={uploading}
            disabled={expired}
          />
        )}

        {/* File list */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-medium text-[#fefeff]/50 uppercase tracking-wider">
              Shared Files ({files.length})
            </h2>
          </div>

          {files.length === 0 ? (
            <Card className="text-center py-10">
              <p className="text-[#fefeff]/30 text-sm">
                No files shared yet. Upload a file to get started.
              </p>
            </Card>
          ) : (
            <div className="space-y-2">
              {files.map((file) => (
                <Card
                  key={file.id}
                  className="flex items-center gap-4 py-3 px-4 hover:bg-white/[0.05] transition-colors duration-200"
                >
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-white/[0.03] flex items-center justify-center">
                    {getFileIcon(file.file_name)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[#fefeff] text-sm font-medium truncate">
                      {file.file_name}
                    </p>
                    <p className="text-[#fefeff]/30 text-xs">
                      {new Date(file.uploaded_at).toLocaleTimeString()}
                    </p>
                  </div>
                  {file.signed_url && (
                    <a
                      href={file.signed_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-shrink-0 p-2 rounded-lg bg-[#6dd07d]/10 text-[#6dd07d] hover:bg-[#6dd07d]/20 transition-colors duration-200"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                    </a>
                  )}
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
