const SECRET = "r8H6vXFeQdEshn+wPG9ebCeNOrwET/v2jrdDFX8BeR4=";

export function encrypt(text: string): string {
  const combined = SECRET + text;
  return btoa(combined);
}

export function decrypt(encrypted: string): string {
  const combined = atob(encrypted);
  return combined.substring(SECRET.length);
}
