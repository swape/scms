export function getCssLength(value: string | number | undefined): string {
  if (value === undefined || value === '') {
    return ''
  }

  if (typeof value === 'number') {
    return `${value}px`
  }

  const trimmed = value.trim()
  if (!/^-?(?:\d+|\d*\.\d+)(?:px|rem|em|%)?$/i.test(trimmed)) {
    return ''
  }

  return /^-?(?:\d+|\d*\.\d+)$/.test(trimmed) ? `${trimmed}px` : trimmed
}

export function getColorValue(value: string | number | undefined): string {
  const colorKey = String(value ?? '')
  return /^[a-zA-Z0-9_-]+$/.test(colorKey) ? `var(--${colorKey})` : ''
}

export function getTextAlign(value: string | number | undefined): string {
  return ['left', 'center', 'right', 'justify'].includes(String(value)) ? `text-align: ${value};` : ''
}
