// Setup Supabase storage bucket
const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  "https://ceszkugssgzglavtyfpd.supabase.co",
  "sb_publishable_xVkDSMvcnmvg_ENY90iZfg_waQHQUm0"
);

async function setupStorage() {
  try {
    console.log("Creating storage bucket 'rooms-storage'...");

    const { data, error } = await supabase.storage.createBucket("rooms-storage", {
      public: false,
      fileSizeLimit: 10 * 1024 * 1024, // 10MB
      allowedMimeTypes: [
        "image/jpeg",
        "image/png",
        "image/gif",
        "image/webp",
        "application/pdf",
      ],
    });

    if (error) {
      if (error.message?.includes("already exists")) {
        console.log("✓ Bucket 'rooms-storage' already exists");
      } else {
        console.error("Error:", error.message);
      }
    } else {
      console.log("✓ Bucket 'rooms-storage' created successfully!");
    }
  } catch (err) {
    console.error("Error:", err.message);
  }
}

setupStorage();
