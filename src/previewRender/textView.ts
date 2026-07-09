import type { ContentType } from '../types/types.ts'
import { wrapWithStyle } from './common.ts'

function formatTextContent(content: string): string {
  return content.replaceAll('\n', '<br />')
}

export function renderText(content: ContentType): string {
  const header = content?.title ? `<h2 class="paragraph-title" >${content?.title}</h2>` : ''
  const output = `<div data-type="${content?.type || ''}" data-id="${content?.id || ''}">${header}<p>${formatTextContent(content?.content || '')}</p></div>`

  return wrapWithStyle(content, output)
}
