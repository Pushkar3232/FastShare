"use client";

import { useCallback, useState, useRef } from "react";
import { ALLOWED_FILE_TYPES, MAX_FILE_SIZE } from "@/lib/constants";
import { formatFileSize } from "@/lib/utils";

interface UploadAreaProps {
  onFileSelect: (file: File) => void;
  uploading?: boolean;
  disabled?: boolean;
}

export default function UploadArea({
  onFileSelect,
  uploading = false,
  disabled = false,
}: UploadAreaProps) {
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): string | null => {
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      return "Only images (JPEG, PNG, GIF, WebP) and PDFs are allowed.";
    }
    if (file.size > MAX_FILE_SIZE) {
      return `File too large. Max size is ${formatFileSize(MAX_FILE_SIZE)}.`;
    }
    return null;
  };

  const handleFile = useCallback(
    (file: File) => {
      const err = validateFile(file);
      if (err) {
        setError(err);
        return;
      }
      setError(null);
      onFileSelect(file);
    },
    [onFileSelect]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      if (disabled || uploading) return;
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [disabled, uploading, handleFile]
  );

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled && !uploading) setDragOver(true);
  };

  const handleDragLeave = () => setDragOver(false);

  const handleClick = () => {
    if (!disabled && !uploading) fileInputRef.current?.click();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    e.target.value = "";
  };

  return (
    <div className="w-full">
      <div
        onClick={handleClick}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`relative w-full min-h-50 flex flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed transition-all duration-200 cursor-pointer ${
          disabled || uploading
            ? "border-white/6 bg-white/1 cursor-not-allowed opacity-50"
            : dragOver
              ? "border-brand bg-brand/5 scale-[1.01]"
              : "border-white/10 bg-white/2 hover:border-brand/50 hover:bg-white/4"
        }`}
      >
        {uploading ? (
          <>
            <div className="w-10 h-10 border-3 border-brand/30 border-t-brand rounded-full animate-spin" />
            <p className="text-primary/70 text-sm">Uploading...</p>
          </>
        ) : (
          <>
            <div className="w-14 h-14 rounded-xl bg-brand/10 flex items-center justify-center">
              <svg
                className="w-7 h-7 text-brand"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
            </div>
            <div className="text-center">
              <p className="text-primary font-medium">
                Drag & drop or <span className="text-brand">browse</span>
              </p>
              <p className="text-primary/40 text-sm mt-1">
                Images & PDFs up to {formatFileSize(MAX_FILE_SIZE)}
              </p>
            </div>
          </>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept={ALLOWED_FILE_TYPES.join(",")}
          onChange={handleChange}
          className="hidden"
        />
      </div>
      {error && (
        <p className="mt-2 text-sm text-red-400 text-center">{error}</p>
      )}
    </div>
  );
}
