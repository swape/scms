import type { ContentType } from '../types/types.ts'
import { wrapWithStyle } from './common.ts'

export function renderHeader(content: ContentType): string {
  let output = `<${content?.headerLevel || 'h1'} data-type="${content?.type || ''}" data-id="${content?.id || ''}">${content?.content || ''}</${content?.headerLevel || 'h1'}>`

  return wrapWithStyle(content, output)
}
