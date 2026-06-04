/**
 * Sanitizes and validates image URLs for Next.js <Image> component.
 * If the URL is not absolute (does not start with http/https) and is not
 * a valid relative path (does not start with /), it returns a placeholder.
 */
export const getValidImageUrl = (url: string | undefined | null): string => {
  if (!url) return "/placeholder.png";
  const trimmed = url.trim();
  if (
    trimmed.startsWith("http://") ||
    trimmed.startsWith("https://") ||
    trimmed.startsWith("/")
  ) {
    return trimmed;
  }
  return "/placeholder.png";
};
