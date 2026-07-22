import { getStorage } from '../localstorage.ts'
import type { ProjectType } from '../types/types.ts'

function escapeHtml(text: string): string {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

function sanitizeHref(url: string): string {
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

export function renderFooter(): void {
  const footerEl = document.getElementById('footer')
  if (!footerEl) {
    return
  }

  const project = getStorage('currentProject') as ProjectType | null
  const elements = project?.footer?.elements ?? []

  if (elements.length === 0) {
    footerEl.innerHTML = ''
    return
  }

  const links = elements.filter((el) => el.type === 'link')
  const socials = elements.filter((el) => el.type === 'social')
  const texts = elements.filter((el) => el.type === 'text')
  const htmlBlocks = elements.filter((el) => el.type === 'html')

  const parts: string[] = []

  if (links.length > 0 || socials.length > 0) {
    const linkItems = links.map((el) => {
      const href = sanitizeHref(el.link?.url ?? '')
      const target = el.link?.target ?? '_self'
      const rel = target === '_blank' ? ' rel="noopener noreferrer"' : ''
      return `<a href="${href}" target="${target}"${rel} class="footer-link">${escapeHtml(el.title)}</a>`
    })

    const socialItems = socials.map((el) => {
      const href = sanitizeHref(el.link?.url ?? '')
      const label = el.socialPlatform ?? el.title
      return `<a href="${href}" target="_blank" rel="noopener noreferrer" class="footer-social">${escapeHtml(label)}</a>`
    })

    parts.push(`<nav class="footer-nav">${[...linkItems, ...socialItems].join('')}</nav>`)
  }

  for (const el of texts) {
    parts.push(`<p class="footer-text">${escapeHtml(el.text ?? '')}</p>`)
  }

  for (const el of htmlBlocks) {
    // html blocks contain user-authored markup (trusted content)
    parts.push(`<div class="footer-html">${el.html ?? ''}</div>`)
  }

  footerEl.innerHTML = `<div class="container footer-inner">${parts.join('')}</div>`
}
