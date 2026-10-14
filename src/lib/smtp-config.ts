const SMTP_SETTINGS = [
  "SMTP_HOST", "SMTP_PORT", "SMTP_USER", "SMTP_PASS", "CONTACT_RECEIVER_EMAIL",
] as const;

// Dashboard values may contain whitespace or literal quotes from a pasted .env line.
function normalizeSetting(value: string | undefined) {
  if (value === undefined) return undefined;
  const trimmed = value.trim();
  const quote = trimmed[0];
  if (trimmed.length >= 2 && (quote === '"' || quote === "'") && trimmed.endsWith(quote)) {
    return trimmed.slice(1, -1);
  }
  return trimmed;
}

export function getSmtpConfig(env: Record<string, string | undefined> = process.env) {
  const values = Object.fromEntries(SMTP_SETTINGS.map((key) => [key, normalizeSetting(env[key])])) as
    Record<(typeof SMTP_SETTINGS)[number], string | undefined>;
  return {
    host: values.SMTP_HOST || "mail.91.com.tr",
    port: Number(values.SMTP_PORT || "587"),
    user: values.SMTP_USER,
    pass: values.SMTP_PASS,
    receiver: values.CONTACT_RECEIVER_EMAIL || values.SMTP_USER,
    rawPassword: env.SMTP_PASS,
    normalizedSettings: SMTP_SETTINGS.filter((key) => env[key] !== values[key]),
  };
}

export function getSmtpErrorDetails(error: unknown, config: ReturnType<typeof getSmtpConfig>) {
  const smtpError = error as {
    code?: string; command?: string; responseCode?: number; response?: string; message?: string;
  } | null;
  const passwords = [config.rawPassword, config.pass].filter((value): value is string => !!value);
  const secrets = [
    ...passwords,
    ...passwords.map((value) => Buffer.from(value).toString("base64")),
    ...(config.user && config.pass
      ? [Buffer.from(`\0${config.user}\0${config.pass}`).toString("base64")]
      : []),
  ].sort((a, b) => b.length - a.length);

  function redact(value: string | undefined) {
    if (typeof value !== "string") return undefined;
    let result = value;
    for (const secret of secrets) result = result.replaceAll(secret, "[REDACTED]");
    return result.slice(0, 1_000);
  }

  return {
    code: redact(smtpError?.code),
    command: redact(smtpError?.command),
    responseCode: smtpError?.responseCode,
    response: redact(smtpError?.response),
    message: redact(smtpError?.message),
    smtpHost: redact(config.host),
    smtpPort: config.port,
    smtpUser: redact(config.user),
    normalizedSettings: config.normalizedSettings,
  };
}
