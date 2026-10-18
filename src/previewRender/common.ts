export function sanitizeHref(url: string): string {
  if (!url) {
    return '#'
  }
  if (url.startsWith('/') || url.startsWith('#') || url.startsWith('?')) {
    return url
  }
  try {
    const parsed = new URL(url)
    if (parsed.protocol === 'http:' || parsed.protocol === 'https:' || parsed.protocol === 'mailto:') {
      return url
    }
    return '#'
  } catch {
    return '#'
  }
}
