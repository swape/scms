import type { ContentType } from '../types/types.ts'

export function wrapWithStyle(content: ContentType, innerOutput: string): string {
  if (!content?.style) {
    return innerOutput || ''
  }

  const style = content.style
  const styles = `${style?.backgroundColor ? `background-color: var(--${style.backgroundColor});` : ''}${style?.textColor ? `color: var(--${style.textColor});` : ''}`
  // TODO: add other style later

  return `<section class="${style?.wrapper || ''}" style="${styles}">${innerOutput}</section>`
}
