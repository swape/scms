import type { ContentType } from '../types/types.ts'

function toCssLength(value: string | number | undefined): string {
  if (value === '' || value === undefined) {
    return ''
  }

  if (typeof value === 'number') {
    return `${value}px`
  }

  const parsed = Number(value)

  if (!Number.isNaN(parsed)) {
    return `${parsed}px`
  }

  return value.trim()
}

function getPaddingStyles(style: Record<string, string | number>): string {
  const paddingMode = String(style.paddingMode || 'all')

  if (paddingMode === 'individual') {
    const top = toCssLength(style.paddingTop)
    const right = toCssLength(style.paddingRight)
    const bottom = toCssLength(style.paddingBottom)
    const left = toCssLength(style.paddingLeft)

    return `${top ? `padding-top: ${top};` : ''}${right ? `padding-right: ${right};` : ''}${bottom ? `padding-bottom: ${bottom};` : ''}${left ? `padding-left: ${left};` : ''}`
  }

  const value = toCssLength(style.paddingAll)

  if (value) {
    return `padding: ${value};`
  }

  return ''
}

function getMarginStyles(style: Record<string, string | number>): string {
  const top = toCssLength(style.marginTop)
  const bottom = toCssLength(style.marginBottom)

  return `${top ? `margin-top: ${top};` : ''}${bottom ? `margin-bottom: ${bottom};` : ''}`
}

export function wrapWithStyle(content: ContentType, innerOutput: string): string {
  if (!content?.style) {
    return innerOutput || ''
  }

  const style = content.style
  const styles = `${style?.backgroundColor ? `background-color: var(--${style.backgroundColor});` : ''}${style?.textColor ? `color: var(--${style.textColor});` : ''}${getPaddingStyles(style)}${getMarginStyles(style)}`
  // TODO: add other style later

  return `<section class="${style?.wrapper || ''}" style="${styles}">${innerOutput}</section>`
}
