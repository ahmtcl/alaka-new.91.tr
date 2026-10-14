import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { getSmtpConfig, getSmtpErrorDetails } from "@/lib/smtp-config";

export const runtime = "nodejs";

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (character) => {
    const entities: Record<string, string> = {
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
    };
    return entities[character];
  });
}

export async function POST(request: NextRequest) {
  const smtpConfig = getSmtpConfig();
  try {
    const body = await request.json().catch(() => null);
    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return NextResponse.json({ error: "Geçersiz form verisi." }, { status: 400 });
    }
    const { name, email, message, attachmentUrl, attachmentName, num1, num2, answer } = body;

    // Check required fields
    if (typeof name !== "string" || !name.trim() || typeof email !== "string" ||
        !/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(email) ||
        (message !== undefined && typeof message !== "string") ||
        (attachmentName !== undefined && typeof attachmentName !== "string") ||
        (attachmentUrl !== undefined && typeof attachmentUrl !== "string") ||
        num1 === undefined || num2 === undefined || answer === undefined) {
      return NextResponse.json(
        { error: "Lütfen gerekli tüm alanları doldurun." },
        { status: 400 }
      );
    }

    // Verify security question (dynamic math question)
    const expectedAnswer = Number(num1) + Number(num2);
    if (!Number.isInteger(num1) || num1 < 1 || num1 > 9 ||
        !Number.isInteger(num2) || num2 < 1 || num2 > 9 ||
        (typeof answer !== "string" && typeof answer !== "number") ||
        Number(answer) !== expectedAnswer) {
      return NextResponse.json(
        { error: "Güvenlik sorusu cevabı yanlış. Lütfen tekrar deneyin." },
        { status: 400 }
      );
    }

    if (attachmentUrl) {
      try {
        if (new URL(attachmentUrl).protocol !== "https:") throw new Error("Invalid URL");
      } catch {
        return NextResponse.json({ error: "Geçersiz dosya bağlantısı." }, { status: 400 });
      }
    }

    // SMTP Configuration from env vars
    const { host, port, user, pass, receiver } = smtpConfig;

    if (!user || !pass || !Number.isInteger(port) || port < 1 || port > 65535) {
      console.error("SMTP credentials are missing or SMTP_PORT is invalid.");
      return NextResponse.json(
        { error: "E-posta gönderim altyapısı yapılandırılmamış." },
        { status: 500 }
      );
    }

    // Configure Nodemailer transporter
    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      requireTLS: port !== 465, // Port 587 upgrades the connection with STARTTLS.
      connectionTimeout: 15_000,
      greetingTimeout: 15_000,
      socketTimeout: 30_000,
      auth: {
        user,
        pass,
      },
    });

    // Premium dark-themed HTML Email content
    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Yeni Temas Formu Başvurusu</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      background-color: #0d0d0d;
      color: #f3f3f3;
      margin: 0;
      padding: 20px;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #121212;
      border: 1px solid #262626;
      border-radius: 8px;
      padding: 40px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
    }
    .header {
      border-bottom: 1px solid #262626;
      padding-bottom: 20px;
      margin-bottom: 30px;
    }
    .header h1 {
      font-size: 22px;
      font-weight: 300;
      letter-spacing: 0.15em;
      margin: 0;
      color: #ffffff;
      text-transform: uppercase;
    }
    .header p {
      font-size: 13px;
      color: #8c8c8c;
      margin: 5px 0 0 0;
    }
    .content-section {
      margin-bottom: 25px;
    }
    .label {
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: #8c8c8c;
      margin-bottom: 6px;
      font-weight: 600;
    }
    .value {
      font-size: 15px;
      line-height: 1.6;
      color: #e5e5e5;
    }
    .value-message {
      background-color: #181818;
      border: 1px solid #262626;
      border-radius: 4px;
      padding: 15px;
      white-space: pre-wrap;
    }
    .attachment-button {
      display: inline-block;
      margin-top: 8px;
      padding: 12px 24px;
      background-color: transparent;
      border: 1px solid #404040;
      color: #ffffff;
      text-decoration: none;
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      font-weight: 500;
      transition: all 0.2s ease;
    }
    .attachment-button:hover {
      background-color: #ffffff;
      color: #0d0d0d;
      border-color: #ffffff;
    }
    .footer {
      border-top: 1px solid #262626;
      padding-top: 20px;
      margin-top: 40px;
      font-size: 11px;
      color: #595959;
      text-align: center;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>ALAKA MEDIA</h1>
      <p>Yeni Temas Formu Başvurusu</p>
    </div>
    
    <div class="content-section">
      <div class="label">Gönderen Adı Soyadı</div>
      <div class="value">${escapeHtml(name)}</div>
    </div>
    
    <div class="content-section">
      <div class="label">E-posta Adresi</div>
      <div class="value">
        <a href="mailto:${escapeHtml(email)}" style="color: #ffffff; text-decoration: underline;">${escapeHtml(email)}</a>
      </div>
    </div>
    
    <div class="content-section">
      <div class="label">Mesaj</div>
      <div class="value value-message">${message ? escapeHtml(message) : "<i>Mesaj belirtilmedi</i>"}</div>
    </div>
    
    ${
      attachmentUrl
        ? `
    <div class="content-section">
      <div class="label">Ekli Dosya</div>
      <div class="value">
        <a href="${escapeHtml(attachmentUrl)}" class="attachment-button" target="_blank">📎 ${
            escapeHtml(attachmentName || "Ekli Dosyayı İndir")
          }</a>
      </div>
    </div>
    `
        : ""
    }
    
    <div class="footer">
      Bu e-posta Alaka Media web sitesi temas formu üzerinden otomatik olarak gönderilmiştir.
    </div>
  </div>
</body>
</html>
`;

    // Send email using Nodemailer
    const result = await transporter.sendMail({
      from: { name: "Alaka Media", address: user },
      to: receiver,
      replyTo: email,
      subject: `Yeni Temas Formu Başvurusu - ${name}`,
      text: `Gönderen: ${name}\nE-posta: ${email}\n\n${message || "Mesaj belirtilmedi"}${attachmentUrl ? `\n\nEkli dosya: ${attachmentUrl}` : ""}`,
      html: htmlContent,
    });

    if (result.accepted.length === 0 || result.rejected.length > 0) {
      throw new Error("SMTP server rejected the contact recipient.");
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Mail gönderme hatası:", getSmtpErrorDetails(error, smtpConfig));
    return NextResponse.json(
      { error: "E-posta gönderilemedi. Lütfen tekrar deneyin veya doğrudan alaka@91.com.tr adresine yazın." },
      { status: 500 }
    );
  }
}
