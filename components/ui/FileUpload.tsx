"use client";
import { cn } from "@/lib/utils";
import React, { useRef, useState, useCallback } from "react";
import { motion } from "motion/react";
import { IconUpload, IconFile, IconPhoto, IconFileTypePdf } from "@tabler/icons-react";
import { useDropzone } from "react-dropzone";
import { ALLOWED_FILE_TYPES, MAX_FILE_SIZE } from "@/lib/constants";
import { formatFileSize } from "@/lib/utils";

const mainVariant = {
  initial: {
    x: 0,
    y: 0,
  },
  animate: {
    x: 20,
    y: -20,
    opacity: 0.9,
  },
};

const secondaryVariant = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
  },
};

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  uploading?: boolean;
  disabled?: boolean;
}

export const FileUpload = ({
  onFileSelect,
  uploading = false,
  disabled = false,
}: FileUploadProps) => {
  const [files, setFiles] = useState<File[]>([]);
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

  const handleFileChange = useCallback((newFiles: File[]) => {
    if (disabled || uploading) return;
    
    const file = newFiles[0];
    if (!file) return;

    const err = validateFile(file);
    if (err) {
      setError(err);
      return;
    }
    
    setError(null);
    setFiles([file]);
    onFileSelect(file);
  }, [disabled, uploading, onFileSelect]);

  const handleClick = () => {
    if (!disabled && !uploading) {
      fileInputRef.current?.click();
    }
  };

  const { getRootProps, isDragActive } = useDropzone({
    multiple: false,
    noClick: true,
    onDrop: handleFileChange,
    onDropRejected: () => {
      setError("File not accepted. Please check file type and size.");
    },
    disabled: disabled || uploading,
  });

  const getFileIcon = (type: string) => {
    if (type === "application/pdf") {
      return <IconFileTypePdf className="h-5 w-5 text-red-400" />;
    }
    if (type.startsWith("image/")) {
      return <IconPhoto className="h-5 w-5 text-brand" />;
    }
    return <IconFile className="h-5 w-5 text-brand" />;
  };

  // Clear files after successful upload
  React.useEffect(() => {
    if (!uploading && files.length > 0) {
      const timer = setTimeout(() => setFiles([]), 2000);
      return () => clearTimeout(timer);
    }
  }, [uploading, files.length]);

  return (
    <div className="w-full" {...getRootProps()}>
      <motion.div
        onClick={handleClick}
        whileHover={!disabled && !uploading ? "animate" : undefined}
        className={cn(
          "group/file relative block w-full cursor-pointer overflow-hidden rounded-2xl p-6 sm:p-8 md:p-10 transition-all duration-300",
          "border-2 border-dashed",
          disabled || uploading
            ? "border-white/6 bg-white/1 cursor-not-allowed opacity-50"
            : isDragActive
              ? "border-brand bg-brand/8 scale-[1.01]"
              : "border-white/10 bg-white/2 hover:border-brand/50 hover:bg-white/4 touch-manipulation"
        )}
      >
        <input
          ref={fileInputRef}
          id="file-upload-handle"
          type="file"
          accept={ALLOWED_FILE_TYPES.join(",")}
          onChange={(e) => handleFileChange(Array.from(e.target.files || []))}
          className="hidden"
          disabled={disabled || uploading}
        />
        
        <div className="absolute inset-0 mask-[radial-gradient(ellipse_at_center,white,transparent)]">
          <GridPattern />
        </div>
        
        <div className="flex flex-col items-center justify-center relative z-10">
          {uploading ? (
            <div className="flex flex-col items-center gap-3 sm:gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 border-3 border-brand/30 border-t-brand rounded-full animate-spin" />
              <p className="text-primary/70 font-medium text-sm sm:text-base">Uploading...</p>
            </div>
          ) : (
            <>
              <p className="relative z-20 font-semibold text-base sm:text-lg text-primary">
                Upload file
              </p>
              <p className="relative z-20 mt-2 text-xs sm:text-sm text-primary/50">
                Drag & drop your files here or click to upload
              </p>
              <p className="relative z-20 mt-1 text-[10px] sm:text-xs text-primary/30">
                Images & PDFs up to {formatFileSize(MAX_FILE_SIZE)}
              </p>
              
              <div className="relative mx-auto mt-6 sm:mt-8 w-full max-w-xl">
                {files.length > 0 &&
                  files.map((file, idx) => (
                    <motion.div
                      key={"file" + idx}
                      layoutId={idx === 0 ? "file-upload" : "file-upload-" + idx}
                      className={cn(
                        "relative z-40 mx-auto mt-3 sm:mt-4 flex w-full flex-col items-start justify-start overflow-hidden rounded-xl p-3 sm:p-4 md:h-24",
                        "bg-white/3 border border-white/8",
                        "shadow-[0px_10px_50px_rgba(0,0,0,0.3)]"
                      )}
                    >
                      <div className="flex w-full items-center justify-between gap-3 sm:gap-4">
                        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                          <div className="p-1.5 sm:p-2 rounded-lg bg-white/5 shrink-0">
                            {getFileIcon(file.type)}
                          </div>
                          <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            layout
                            className="max-w-37.5 sm:max-w-xs truncate text-xs sm:text-sm font-medium text-primary"
                          >
                            {file.name}
                          </motion.p>
                        </div>
                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          layout
                          className="w-fit shrink-0 rounded-lg px-2 sm:px-3 py-1 text-[10px] sm:text-xs font-medium bg-brand/10 text-brand"
                        >
                          {(file.size / (1024 * 1024)).toFixed(2)} MB
                        </motion.p>
                      </div>

                      <div className="mt-2 sm:mt-3 flex w-full flex-col items-start justify-between text-[10px] sm:text-xs text-primary/40 md:flex-row md:items-center gap-1.5 sm:gap-2">
                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          layout
                          className="rounded-md bg-white/5 px-1.5 sm:px-2 py-0.5 sm:py-1 truncate max-w-45 sm:max-w-none"
                        >
                          {file.type || "Unknown type"}
                        </motion.p>
                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          layout
                          className="hidden sm:block"
                        >
                          modified {new Date(file.lastModified).toLocaleDateString()}
                        </motion.p>
                      </div>
                    </motion.div>
                  ))}
                  
                {!files.length && (
                  <motion.div
                    layoutId="file-upload"
                    variants={mainVariant}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 20,
                    }}
                    className={cn(
                      "relative z-40 mx-auto mt-3 sm:mt-4 flex h-28 sm:h-32 w-full max-w-28 sm:max-w-32 items-center justify-center rounded-xl",
                      "bg-white/3 border border-white/8",
                      "shadow-[0px_10px_50px_rgba(0,0,0,0.3)]",
                      "group-hover/file:shadow-[0_0_40px_rgba(109,208,125,0.2)]"
                    )}
                  >
                    {isDragActive ? (
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex flex-col items-center gap-2 text-brand"
                      >
                        <span className="text-xs sm:text-sm font-medium">Drop it</span>
                        <IconUpload className="h-4 w-4 sm:h-5 sm:w-5" />
                      </motion.p>
                    ) : (
                      <IconUpload className="h-5 w-5 sm:h-6 sm:w-6 text-brand" />
                    )}
                  </motion.div>
                )}

                {!files.length && (
                  <motion.div
                    variants={secondaryVariant}
                    className="absolute inset-0 z-30 mx-auto mt-3 sm:mt-4 flex h-28 sm:h-32 w-full max-w-28 sm:max-w-32 items-center justify-center rounded-xl border-2 border-dashed border-brand/40 bg-transparent opacity-0"
                  ></motion.div>
                )}
              </div>
            </>
          )}
        </div>
      </motion.div>
      
      {error && (
        <motion.p 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-2 sm:mt-3 text-xs sm:text-sm text-red-400 text-center px-2"
        >
          {error}
        </motion.p>
      )}
    </div>
  );
};

export function GridPattern() {
  const columns = 41;
  const rows = 11;
  return (
    <div className="flex shrink-0 scale-105 flex-wrap items-center justify-center gap-x-px gap-y-px bg-bg">
      {Array.from({ length: rows }).map((_, row) =>
        Array.from({ length: columns }).map((_, col) => {
          const index = row * columns + col;
          return (
            <div
              key={`${col}-${row}`}
              className={`flex h-10 w-10 shrink-0 rounded-xs ${
                index % 2 === 0
                  ? "bg-[#0a0a0a]"
                  : "bg-[#0a0a0a] shadow-[0px_0px_1px_3px_rgba(0,0,0,0.8)_inset]"
              }`}
            />
          );
        })
      )}
    </div>
  );
}

export default FileUpload;
