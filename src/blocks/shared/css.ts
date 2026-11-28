import type { CssLength, CssLengthUnit, SizeUnit } from '../../types/types.ts'

export function parseCssLength(value: string | number | undefined, defaultUnit: SizeUnit = 'px'): CssLength | undefined {
  if (typeof value === 'number') {
    return Number.isFinite(value) ? { value, unit: defaultUnit } : undefined
  }
  if (typeof value !== 'string') {
    return undefined
  }
  const match = /^(-?(?:\d+|\d*\.\d+)(?:e[+-]?\d+)?)(px|rem|ch|em|%)?$/i.exec(value.trim())
  if (!match) {
    return undefined
  }
  const numericValue = Number(match[1])
  if (!Number.isFinite(numericValue)) {
    return undefined
  }
  return { value: numericValue, unit: (match[2]?.toLowerCase() as CssLengthUnit | undefined) ?? defaultUnit }
}

export function getCssLength(value: string | number | undefined): string {
  const length = parseCssLength(value)
  return length ? `${length.value}${length.unit}` : ''
}

export function getColorValue(value: string | number | undefined): string {
  const colorKey = String(value ?? '')
  return /^[a-zA-Z0-9_-]+$/.test(colorKey) ? `var(--${colorKey})` : ''
}

export function getTextAlign(value: string | number | undefined): string {
  return ['left', 'center', 'right', 'justify'].includes(String(value)) ? `text-align: ${value};` : ''
}

export function getButtonColorDeclarations(background: string | number | undefined, text: string | number | undefined): string[] {
  return [`background-color: ${getColorValue(background) || 'var(--text_1)'};`, `color: ${getColorValue(text) || 'var(--bg_1)'};`]
}
