const SECRET = "r8H6vXFeQdEshn+wPG9ebCeNOrwET/v2jrdDFX8BeR4=";

export function encrypt(text: string): string {
  const combined = SECRET + text;
  return Buffer.from(combined).toString("base64");
}

export function decrypt(encrypted: string): string {
  const combined = Buffer.from(encrypted, "base64").toString("utf8");
  return combined.substring(SECRET.length);
}
