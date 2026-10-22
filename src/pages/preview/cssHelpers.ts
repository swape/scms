import { getColorValue, getCssLength } from '../../blocks/shared/css.ts'
import { getElementDefinition } from '../../components/editor/elements-list.ts'
import type { ColorType, ContentType } from '../../types/types.ts'

export { getColorValue } from '../../blocks/shared/css.ts'

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

  for (const rule of getElementDefinition(item.type)?.css?.(item, selector) ?? []) {
    addRule(rules, rule.selector, rule.declarations)
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
