import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

/**
 * Checks if Supabase is properly configured via environment variables
 */
export function isSupabaseConfigured(): boolean {
  return Boolean(
    supabaseUrl &&
    supabaseUrl.startsWith("http") &&
    (supabaseAnonKey || supabaseServiceKey)
  );
}

/**
 * Client-side safe Supabase instance
 */
export const supabase = isSupabaseConfigured()
  ? createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        fetch: (url, init) => fetch(url, { ...init, cache: "no-store" }),
      },
    })
  : null;

/**
 * Server-side privileged Supabase instance
 */
export function getServiceSupabase() {
  if (!isSupabaseConfigured()) return null;
  const key = supabaseServiceKey || supabaseAnonKey;
  return createClient(supabaseUrl, key, {
    auth: { persistSession: false },
    global: {
      fetch: (url, init) => fetch(url, { ...init, cache: "no-store" }),
    },
  });
}

/**
 * Default storage bucket name for portfolio assets
 */
export const STORAGE_BUCKET = process.env.SUPABASE_STORAGE_BUCKET || "portfolio-assets";

/**
 * Uploads a binary file to Supabase Storage and returns the public CDN URL
 */
export async function uploadToSupabaseStorage(
  fileBuffer: Buffer,
  fileName: string,
  contentType: string,
  folder: string = "uploads"
): Promise<{ success: boolean; url?: string; error?: string }> {
  try {
    const client = getServiceSupabase();
    if (!client) {
      return { success: false, error: "Supabase credentials not configured in .env.local" };
    }

    const cleanFileName = fileName.replace(/[^a-zA-Z0-9._-]/g, "_");
    const filePath = `${folder}/${Date.now()}_${cleanFileName}`;

    const { data, error } = await client.storage
      .from(STORAGE_BUCKET)
      .upload(filePath, fileBuffer, {
        contentType,
        upsert: true,
      });

    if (error) {
      return { success: false, error: error.message };
    }

    // Get public URL
    const { data: publicUrlData } = client.storage
      .from(STORAGE_BUCKET)
      .getPublicUrl(filePath);

    return { success: true, url: publicUrlData.publicUrl };
  } catch (err: any) {
    return { success: false, error: err?.message || "Failed to upload file to Supabase" };
  }
}
