import { NextRequest, NextResponse } from "next/server";
import { getAdminStorage } from "@/lib/firebase-admin";

// Dosya boyutu limiti: 30 MB
const MAX_FILE_SIZE = 30 * 1024 * 1024; // 30 MB in bytes

// İzin verilen dosya formatları
const ALLOWED_MIME_TYPES = [
  'application/msword',                                                                     // .doc
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',              // .docx
  'application/pdf',                                                                        // .pdf
  'image/jpeg',                                                                             // .jpg, .jpeg
  'application/vnd.ms-excel',                                                              // .xls
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',                    // .xlsx
  'image/png'                                                                               // .png
];

const ALLOWED_EXTENSIONS = ['.doc', '.docx', '.pdf', '.jpg', '.jpeg', '.xls', '.xlsx', '.png'];

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file || file.size === 0) {
      return NextResponse.json({ error: "Dosya bulunamadı" }, { status: 400 });
    }

    // Dosya boyutu kontrolü
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ 
        error: `Dosya boyutu 30 MB'dan büyük olamaz. (${(file.size / 1024 / 1024).toFixed(2)} MB)` 
      }, { status: 400 });
    }

    // Dosya formatı kontrolü
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    const isValidFormat = ALLOWED_MIME_TYPES.includes(file.type) || ALLOWED_EXTENSIONS.includes(fileExtension);

    if (!isValidFormat) {
      return NextResponse.json({ 
        error: 'Sadece Word, PDF, JPEG, Excel ve PNG dosyaları yüklenebilir.' 
      }, { status: 400 });
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
