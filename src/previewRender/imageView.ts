import type { ContentType } from '../types/types.ts'
import { wrapWithStyle } from './common.ts'

function formatTextContent(content: string): string {
  return content.replaceAll('\n', '<br />')
}

export function renderImage(content: ContentType): string {
  const image = content?.src ? `<img src="${content?.src || ''}" alt="${content?.alt || ''}" loading="lazy" />` : ''
  const header = content?.title ? `<h2 class="paragraph-title" >${content?.title}</h2>` : ''
  const output = `${header}<figure data-type="${content?.type || ''}" data-id="${content?.id || ''}">${image}
  ${content?.caption ? `<figcaption>${formatTextContent(content?.caption || '')}</figcaption>` : ''}</figure>`

  return wrapWithStyle(content, output)
}
