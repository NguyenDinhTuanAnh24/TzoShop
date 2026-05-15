const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

function getHeaders(contentType?: string) {
  const headers: Record<string, string> = {
    apikey: supabaseServiceRoleKey ?? "",
    Authorization: `Bearer ${supabaseServiceRoleKey ?? ""}`,
  };

  if (contentType) {
    headers["Content-Type"] = contentType;
  }

  return headers;
}

export function isSupabaseStorageConfigured() {
  return Boolean(supabaseUrl && supabaseServiceRoleKey);
}

export async function ensureAvatarBucket() {
  if (!isSupabaseStorageConfigured()) {
    throw new Error("Supabase storage is not configured");
  }

  const bucketName = "avatars";
  const checkRes = await fetch(`${supabaseUrl}/storage/v1/bucket/${bucketName}`, {
    headers: getHeaders(),
    cache: "no-store",
  });

  if (checkRes.ok) return;
  if (checkRes.status !== 404) {
    const reason = await checkRes.text().catch(() => "");
    throw new Error(`Cannot access avatar bucket (${checkRes.status}): ${reason || "unknown"}`);
  }

  const createRes = await fetch(`${supabaseUrl}/storage/v1/bucket`, {
    method: "POST",
    headers: getHeaders("application/json"),
    body: JSON.stringify({
      id: bucketName,
      name: bucketName,
      public: true,
      file_size_limit: 2 * 1024 * 1024,
      allowed_mime_types: ["image/jpeg", "image/png", "image/webp"],
    }),
  });

  if (!createRes.ok && createRes.status !== 409) {
    const reason = await createRes.text().catch(() => "");
    throw new Error(`Cannot create avatar bucket (${createRes.status}): ${reason || "unknown"}`);
  }
}

export async function uploadAvatarToSupabase(params: {
  userId: string;
  file: File;
  fileName: string;
}) {
  if (!isSupabaseStorageConfigured()) {
    throw new Error("Supabase storage is not configured");
  }

  const { userId, file, fileName } = params;
  const path = `${userId}/${Date.now()}-${fileName}`;

  const uploadRes = await fetch(
    `${supabaseUrl}/storage/v1/object/avatars/${encodeURI(path)}`,
    {
      method: "POST",
      headers: getHeaders(file.type || "application/octet-stream"),
      body: file,
    },
  );

  if (!uploadRes.ok) {
    const reason = await uploadRes.text().catch(() => "");
    throw new Error(`Upload avatar failed (${uploadRes.status}): ${reason || "unknown"}`);
  }

  return {
    path,
    publicUrl: `${supabaseUrl}/storage/v1/object/public/avatars/${path}`,
  };
}
