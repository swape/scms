import type { ColorType, ContentType } from '../../types/types.ts'

function getCssColor(value: string): string {
  const color = value.trim()
  if (/^#(?:[\da-f]{3}|[\da-f]{4}|[\da-f]{6}|[\da-f]{8})$/i.test(color)) {
    return color
  }

  if (/^(?:rgba?|hsla?|oklab|oklch|lab|lch|color)\([\da-z.%\s,+\/-]+\)$/i.test(color) || /^[a-z]+$/i.test(color)) {
    return color
  }

  return ''
}

function getCssLength(value: string | number | undefined): string {
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

function getColorValue(value: string | number | undefined): string {
  const colorKey = String(value ?? '')
  return /^[a-zA-Z0-9_-]+$/.test(colorKey) ? `var(--${colorKey})` : ''
}

function addRule(rules: Map<string, Set<string>>, selector: string, declarations: string[]) {
  const validDeclarations = declarations.filter(Boolean)
  if (validDeclarations.length > 0) {
    const declarationBlock = validDeclarations.sort().join(' ')
    const selectors = rules.get(declarationBlock) || new Set<string>()
    selectors.add(selector)
    rules.set(declarationBlock, selectors)
  }
}

function addItemCssRules(item: ContentType, rules: Map<string, Set<string>>) {
  const style = item.style || {}
  const id = String(item.id).replace(/[^a-zA-Z0-9_-]/g, (character) => `\\${character}`)
  const selector = `.scms_${id}`
  const declarations = [
    getColorValue(style.backgroundColor) ? `background-color: ${getColorValue(style.backgroundColor)};` : '',
    getColorValue(style.textColor) ? `color: ${getColorValue(style.textColor)};` : '',
  ]

  const borderRadius = getCssLength(style.borderRadius)
  if (borderRadius || style.backgroundColor) {
    declarations.push(`border-radius: ${borderRadius || '8px'};`)
    if (item.type === 'splitBlock') {
      declarations.push('overflow: hidden;')
    }
  }

  if (style.paddingMode === 'individual') {
    for (const side of ['top', 'right', 'bottom', 'left']) {
      const value = getCssLength(style[`padding${side[0].toUpperCase()}${side.slice(1)}`])
      if (value) {
        declarations.push(`padding-${side}: ${value};`)
      }
    }
  } else {
    const padding = getCssLength(style.paddingAll)
    if (padding) {
      declarations.push(`padding: ${padding};`)
    }
  }

  for (const side of ['top', 'bottom']) {
    const value = getCssLength(style[`margin${side[0].toUpperCase()}${side.slice(1)}`])
    if (value) {
      declarations.push(`margin-${side}: ${value};`)
    }
  }

  addRule(rules, selector, declarations)

  const alignments = ['left', 'center', 'right', 'justify']
  const getTextAlign = (value: string | number | undefined) => (alignments.includes(String(value)) ? `text-align: ${value};` : '')

  if (item.type === 'header') {
    addRule(rules, selector, [getTextAlign(style.textAlign)])
  } else if (item.type === 'text') {
    addRule(rules, `${selector} h2`, [getTextAlign(style.titleAlign)])
    addRule(rules, `${selector} p`, [getTextAlign(style.textAlign)])
  } else if (item.type === 'image') {
    addRule(rules, `${selector} h2`, [getTextAlign(style.textAlign)])
    addRule(rules, `${selector} figcaption`, [getTextAlign(style.imageCaptionTextAlign)])
  } else if (item.type === 'link' && item.link?.asButton) {
    addRule(rules, `${selector} .link-button`, [
      getColorValue(item.link.style?.buttonColor) ? `background-color: ${getColorValue(item.link.style?.buttonColor)};` : '',
      getColorValue(item.link.style?.buttonTextColor) ? `color: ${getColorValue(item.link.style?.buttonTextColor)};` : '',
    ])
  } else if (item.type === 'splitBlock') {
    addRule(rules, `${selector} .split-text`, [getCssLength(style.splitTextPadding) ? `padding: ${getCssLength(style.splitTextPadding)};` : ''])
    addRule(rules, `${selector} .link-button`, [
      getColorValue(style.textColor) ? `background-color: ${getColorValue(style.textColor)};` : '',
      getColorValue(style.backgroundColor) ? `color: ${getColorValue(style.backgroundColor)};` : '',
    ])
  }
}

export function getCombinedCss(content: ContentType[]): string {
  const rules = new Map<string, Set<string>>()
  content.forEach((item) => addItemCssRules(item, rules))
  return [...rules].map(([declarations, selectors]) => `${[...selectors].join(', ')} { ${declarations} }`).join('\n')
}

export function cssHelpers(colors: ColorType[]): string {
  const colorDeclarations = colors.flatMap((color) => {
    if (!/^[a-zA-Z_][a-zA-Z0-9_-]*$/.test(color.key) || color.key.endsWith('_dark')) {
      return []
    }

    const lightColor = getCssColor(color.c)
    const darkColor = getCssColor(color.cDark)
    if (!lightColor || !darkColor) {
      return []
    }

    return [`  --${color.key}: light-dark(${lightColor}, ${darkColor});`]
  })

  return `:root {\n  color-scheme: light dark;${colorDeclarations.length ? `\n${colorDeclarations.join('\n')}` : ''}\n}`
}
