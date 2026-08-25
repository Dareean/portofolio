import { NextRequest, NextResponse } from "next/server";
import { isSupabaseConfigured, uploadToSupabaseStorage } from "@/lib/supabase";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const folder = (formData.get("folder") as string) || "projects";

    if (!file) {
      return NextResponse.json(
        { success: false, error: "No file uploaded" },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const fileName = file.name || `upload_${Date.now()}.png`;
    const contentType = file.type || "image/png";

    // 1. Try uploading to Supabase Storage if configured
    if (isSupabaseConfigured()) {
      const supabaseResult = await uploadToSupabaseStorage(
        buffer,
        fileName,
        contentType,
        folder
      );

      if (supabaseResult.success && supabaseResult.url) {
        return NextResponse.json({
          success: true,
          url: supabaseResult.url,
          storage: "supabase",
          message: "Uploaded to Supabase Storage successfully",
        });
      } else {
        console.warn("Supabase upload error, falling back to local:", supabaseResult.error);
      }
    }

    // 2. Local fallback: Save to /public/uploads/
    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const cleanFileName = `${Date.now()}_${fileName.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
    const filePath = path.join(uploadsDir, cleanFileName);
    fs.writeFileSync(filePath, buffer);

    const publicLocalUrl = `/uploads/${cleanFileName}`;

    return NextResponse.json({
      success: true,
      url: publicLocalUrl,
      storage: "local",
      message: "Saved locally in public/uploads/ (Configure Supabase in .env.local for cloud CDN storage)",
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || "File upload failed" },
      { status: 500 }
    );
  }
}
