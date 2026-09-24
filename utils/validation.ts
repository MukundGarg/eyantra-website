export function isValidHttpUrl(value: string | null | undefined): boolean {
  if (!value) return true; // Empty is valid
  try {
    const url = new URL(value.trim());
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}
