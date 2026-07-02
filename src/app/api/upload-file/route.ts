import { NextRequest, NextResponse } from "next/server";
import { getAdminStorage } from "@/lib/firebase-admin";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file || file.size === 0) {
      return NextResponse.json({ error: "Dosya bulunamadı" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const fileName = `contact-attachments/${Date.now()}_${file.name}`;
    const adminStorage = getAdminStorage();
    const bucket = adminStorage.bucket();
    const fileRef = bucket.file(fileName);

    await fileRef.save(buffer, {
      metadata: { contentType: file.type },
    });

    // Signed URL (10 yıl geçerli)
    const [url] = await fileRef.getSignedUrl({
      action: "read",
      expires: Date.now() + 10 * 365 * 24 * 60 * 60 * 1000,
    });

    return NextResponse.json({ url, name: file.name });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("Dosya yükleme hatası:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
