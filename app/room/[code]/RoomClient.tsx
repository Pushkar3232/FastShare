"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { QRCodeSVG } from "qrcode.react";
import { motion, AnimatePresence } from "motion/react";
import { IconQrcode, IconTrash, IconDownload, IconFile, IconPhoto, IconFileTypePdf } from "@tabler/icons-react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import CountdownTimer from "@/components/ui/CountdownTimer";
import FileUpload from "@/components/ui/FileUpload";
import RoomCodeDisplay from "@/components/ui/RoomCodeDisplay";
import { RoomUsersDisplay } from "@/components/ui/Avatar";

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
  const [userCount, setUserCount] = useState(1);

  // Simulate user count based on activity (in real app, use websockets)
  useEffect(() => {
    // Random user count between 1-5 for demo, updates periodically
    const randomizeUsers = () => {
      const baseCount = Math.min(files.length + 1, 5);
      setUserCount(Math.max(1, baseCount));
    };
    randomizeUsers();
  }, [files.length]);

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
      return <IconFileTypePdf className="w-5 h-5 text-red-400" />;
    }
    return <IconPhoto className="w-5 h-5 text-brand" />;
  };

  const handleDownload = useCallback(async (file: FileRecord) => {
    try {
      if (!file.signed_url) {
        alert("File URL not available");
        return;
      }

      // Fetch the file from the signed URL
      const response = await fetch(file.signed_url);
      if (!response.ok) {
        throw new Error("Failed to download file");
      }

      // Convert response to blob
      const blob = await response.blob();

      // Create a temporary URL for the blob
      const url = window.URL.createObjectURL(blob);

      // Create a temporary anchor element and trigger download
      const link = document.createElement("a");
      link.href = url;
      link.download = file.file_name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Clean up the temporary URL
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Download failed");
    }
  }, []);

  return (
    <div className="min-h-screen px-3 sm:px-4 py-6 sm:py-8">
      <div className="max-w-3xl mx-auto space-y-4 sm:space-y-6">
        {/* Header area */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4"
        >
          <RoomCodeDisplay code={room.room_code} />
          <div className="flex items-center gap-3 sm:gap-4">
            <RoomUsersDisplay userCount={userCount} size="sm" />
            <CountdownTimer expiresAt={room.expires_at} onExpired={handleExpired} />
          </div>
        </motion.div>

        {/* Actions bar */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-wrap gap-2 sm:gap-3 justify-center"
        >
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setShowQR(!showQR)}
            className="flex items-center gap-2 text-xs sm:text-sm touch-manipulation"
          >
            <IconQrcode className="w-4 h-4" />
            {showQR ? "Hide" : "Show"} QR Code
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={handleEndSession}
            loading={ending}
            className="flex items-center gap-2 text-xs sm:text-sm touch-manipulation"
          >
            <IconTrash className="w-4 h-4" />
            End Session
          </Button>
        </motion.div>

        {/* QR Code */}
        <AnimatePresence>
          {showQR && roomUrl && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -20 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            >
              <Card className="flex flex-col items-center justify-center py-6 sm:py-8 gap-3 sm:gap-4">
                <div className="bg-white p-3 sm:p-4 rounded-2xl shadow-lg">
                  <QRCodeSVG value={roomUrl} size={window.innerWidth < 640 ? 150 : 180} />
                </div>
                <p className="text-primary/40 text-xs sm:text-sm">Scan to join this room</p>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Expired Banner */}
        <AnimatePresence>
          {expired && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <Card className="text-center py-6 sm:py-8 border-red-500/30 bg-red-500/3">
                <div className="space-y-2 sm:space-y-3 px-4">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto rounded-full bg-red-500/10 flex items-center justify-center">
                    <svg className="w-7 h-7 sm:w-8 sm:h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="text-red-400 font-semibold text-base sm:text-lg">Room Expired</p>
                  <p className="text-primary/50 text-xs sm:text-sm">
                    This room has expired. Files will be cleaned up shortly.
                  </p>
                  <Button variant="primary" onClick={() => router.push("/create")} className="mt-3 sm:mt-4 touch-manipulation">
                    Create New Room
                  </Button>
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Upload area */}
        {!expired && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <FileUpload
              onFileSelect={handleFileSelect}
              uploading={uploading}
              disabled={expired}
            />
          </motion.div>
        )}

        {/* File list */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-3 sm:space-y-4"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-xs sm:text-sm font-medium text-primary/50 uppercase tracking-wider flex items-center gap-2">
              <IconFile className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              Shared Files ({files.length})
            </h2>
          </div>

          {files.length === 0 ? (
            <Card className="text-center py-10 sm:py-12">
              <div className="flex flex-col items-center gap-3">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white/3 flex items-center justify-center">
                  <IconFile className="w-7 h-7 sm:w-8 sm:h-8 text-primary/20" />
                </div>
                <p className="text-primary/30 text-xs sm:text-sm px-4">
                  No files shared yet. Upload a file to get started.
                </p>
              </div>
            </Card>
          ) : (
            <div className="space-y-2.5 sm:space-y-3">
              <AnimatePresence mode="popLayout">
                {files.map((file, index) => (
                  <motion.div
                    key={file.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className="flex items-center gap-3 sm:gap-4 py-3 sm:py-4 px-3.5 sm:px-5 hover:bg-white/5 transition-all duration-200 group touch-manipulation">
                      <div className="shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-white/3 flex items-center justify-center group-hover:bg-white/6 transition-colors">
                        {getFileIcon(file.file_name)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-primary text-xs sm:text-sm font-medium truncate">
                          {file.file_name}
                        </p>
                        <p className="text-primary/30 text-[10px] sm:text-xs mt-0.5">
                          {new Date(file.uploaded_at).toLocaleTimeString()}
                        </p>
                      </div>
                      {file.signed_url && (
                        <button
                          onClick={() => handleDownload(file)}
                          className="shrink-0 p-2.5 sm:p-3 rounded-xl bg-brand/10 text-brand hover:bg-brand/20 hover:scale-105 transition-all duration-200 touch-manipulation cursor-pointer"
                        >
                          <IconDownload className="w-4 h-4 sm:w-5 sm:h-5" />
                        </button>
                      )}
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
