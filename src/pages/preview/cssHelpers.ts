import { getColorValue, getCssLength } from '../../blocks/shared/css.ts'
import { getDefaultLinkSettings } from '../../blocks/shared/helpers.ts'
import { getElementDefinition } from '../../components/editor/elements-list.ts'
import { MOBILE_STYLE_MAX_WIDTH } from '../../constants.ts'
import type { ColorType, ContentType, PageType, ProjectType, StyleMode, StyleValues } from '../../types/types.ts'

export { getColorValue } from '../../blocks/shared/css.ts'

const inlineMarginSides = ['Start', 'End'] as const

function getInlineMargin(value: string | number | undefined): string {
  return value === 'auto' ? value : getCssLength(value)
}

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

function getSelector(item: ContentType): string {
  const id = String(item.id).replace(/[^a-zA-Z0-9_-]/g, (character) => `\\${character}`)
  return `.scms_${id}`
}

function getStyleValue(style: StyleValues | undefined, key: string): string | number | undefined {
  const value = style?.[key]
  return typeof value === 'string' || typeof value === 'number' ? value : undefined
}

function getMobileItem(item: ContentType): ContentType {
  const normalStyle = item.style ?? {}
  const mobileStyle = item.mobileStyle ?? {}
  const style = { ...normalStyle }
  for (const [key, value] of Object.entries(mobileStyle)) {
    if (typeof value !== 'boolean') {
      style[key] = value
    }
  }

  // Resolve active normal padding before applying mobile sides. Inactive saved
  // fields must not reappear when switching between all and individual modes.
  const individual = (mobileStyle.paddingMode ?? normalStyle.paddingMode) === 'individual'
  const mobileAll = getCssLength(getStyleValue(mobileStyle, 'paddingAll'))
  for (const side of ['Top', 'Right', 'Bottom', 'Left']) {
    const key = `padding${side}`
    const normalValue = normalStyle.paddingMode === 'individual' ? normalStyle[key] : normalStyle.paddingAll
    const mobileValue = individual ? getCssLength(getStyleValue(mobileStyle, key)) : mobileAll
    style[key] = mobileValue || getCssLength(normalValue)
  }
  style.paddingMode = 'individual'

  const effective = { ...item, style }
  if (typeof mobileStyle.flipped === 'boolean') {
    effective.flipped = mobileStyle.flipped
  }
  if (item.type === 'link') {
    const link = { ...(item.link ?? getDefaultLinkSettings(item.pageId)), style: { ...item.link?.style } }
    if (typeof mobileStyle.asButton === 'boolean') {
      link.asButton = mobileStyle.asButton
    }
    for (const key of ['buttonColor', 'buttonTextColor']) {
      const value = getStyleValue(mobileStyle, key)
      if (value !== undefined) {
        link.style[key] = value
      }
    }
    effective.link = link
  }
  return effective
}

function addMobileWrapperRules(item: ContentType, rules: Map<string, Set<string>>) {
  const wrapper = item.mobileStyle?.wrapper
  if (wrapper !== '' && wrapper !== 'container' && wrapper !== 'center') {
    return
  }
  const selector = getSelector(item)
  const separateWrapper = item.type === 'splitBlock' || item.type === 'header'
  const wrapperSelector = separateWrapper ? `section:has(> ${selector})` : selector
  const defaultMargin = wrapper === 'container' ? 'auto' : '0'
  addRule(rules, wrapperSelector, [
    `max-width: ${wrapper === 'container' ? '1024px' : 'none'};`,
    ...inlineMarginSides.map((side) => (separateWrapper || !getInlineMargin(item.style?.[`marginInline${side}`]) ? `margin-inline-${side.toLowerCase()}: ${defaultMargin};` : '')),
    `box-sizing: ${wrapper === 'container' ? 'border-box' : 'content-box'};`,
    `display: ${wrapper === 'center' ? 'flex' : 'block'};`,
    `justify-content: ${wrapper === 'center' ? 'center' : 'normal'};`,
    `flex-direction: ${wrapper === 'center' ? 'column' : 'row'};`,
    `align-items: ${wrapper === 'center' ? 'center' : 'normal'};`,
  ])
}

function addItemCssRules(item: ContentType, rules: Map<string, Set<string>>, mode: StyleMode = 'normal') {
  const style = item.style || {}
  const selector = getSelector(item)
  const background = getColorValue(style.backgroundColor) || (mode === 'mobile' && style.backgroundColor === '' ? 'transparent' : '')
  const text = getColorValue(style.textColor) || (mode === 'mobile' && style.textColor === '' ? 'inherit' : '')
  const declarations = [background ? `background-color: ${background};` : '', text ? `color: ${text};` : '']

  const borderRadius = getCssLength(style.borderRadius)
  if (borderRadius || style.backgroundColor) {
    declarations.push(`border-radius: ${borderRadius || '8px'};`)
  }
  if (mode === 'mobile' && !borderRadius && style.backgroundColor === '') {
    declarations.push('border-radius: 0;')
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
  for (const side of inlineMarginSides) {
    const value = getInlineMargin(style[`marginInline${side}`])
    if (value) {
      declarations.push(`margin-inline-${side.toLowerCase()}: ${value};`)
    }
  }

  addRule(rules, selector, declarations)

  for (const rule of getElementDefinition(item.type)?.css?.(item, selector, mode) ?? []) {
    addRule(rules, rule.selector, rule.declarations)
  }
}

function serializeRules(rules: Map<string, Set<string>>): string {
  return [...rules].map(([declarations, selectors]) => `${[...selectors].join(', ')} { ${declarations} }`).join('\n')
}

function mobileMedia(css: string): string {
  return css ? `@media (max-width: ${MOBILE_STYLE_MAX_WIDTH}px) {\n${css}\n}` : ''
}

export function getCombinedCss(content: ContentType[]): string {
  const rules = new Map<string, Set<string>>()
  const mobileRules = new Map<string, Set<string>>()
  for (const item of content) {
    addItemCssRules(item, rules)
    if (item.mobileStyle && Object.keys(item.mobileStyle).length > 0) {
      const mobileItem = getMobileItem(item)
      addItemCssRules(mobileItem, mobileRules, 'mobile')
      addMobileWrapperRules(mobileItem, mobileRules)
    }
  }
  return [serializeRules(rules), mobileMedia(serializeRules(mobileRules))].filter(Boolean).join('\n')
}

export function getPageColorCss(page: PageType | null): string {
  const rules = new Map<string, Set<string>>()
  const mobileRules = new Map<string, Set<string>>()
  const background = getColorValue(page?.colors?.backgroundColorKey)
  const text = getColorValue(page?.colors?.textColorKey)
  addRule(rules, 'body.preview-body', [background ? `background-color: ${background};` : '', text ? `color: ${text};` : ''])
  const mobileBackground = getStyleValue(page?.mobileStyle, 'backgroundColorKey')
  const mobileText = getStyleValue(page?.mobileStyle, 'textColorKey')
  addRule(mobileRules, 'body.preview-body', [
    mobileBackground !== undefined ? `background-color: ${getColorValue(mobileBackground) || 'var(--bg_1)'};` : '',
    mobileText !== undefined ? `color: ${getColorValue(mobileText) || 'var(--text_1)'};` : '',
  ])
  return [serializeRules(rules), mobileMedia(serializeRules(mobileRules))].filter(Boolean).join('\n')
}

export function getMenuCss(menu: ProjectType['menu'] | undefined): string {
  const rules = new Map<string, Set<string>>()
  const mobileRules = new Map<string, Set<string>>()
  const background = getColorValue(menu?.style?.backgroundColor)
  const text = getColorValue(menu?.style?.textColor)
  addRule(rules, '#menu', [background ? `--menu-background: ${background};` : '', text ? `--menu-text: ${text};` : ''])
  const mobileBackground = getStyleValue(menu?.mobileStyle, 'backgroundColor')
  const mobileText = getStyleValue(menu?.mobileStyle, 'textColor')
  addRule(mobileRules, '#menu', [
    mobileBackground !== undefined ? `--menu-background: ${getColorValue(mobileBackground) || 'var(--bg_1, white)'};` : '',
    mobileText !== undefined ? `--menu-text: ${getColorValue(mobileText) || 'var(--text_1, inherit)'};` : '',
  ])
  const layout = menu?.mobileStyle?.layout
  const hasLayout = layout === 'horizontal' || layout === 'vertical'
  if (hasLayout) {
    addRule(mobileRules, '#menu .menu-list', [
      `align-items: ${layout === 'vertical' ? 'flex-start' : 'center'};`,
      `flex-direction: ${layout === 'vertical' ? 'column' : 'row'};`,
      `gap: ${layout === 'vertical' ? '11.2px' : '20px'};`,
    ])
  }
  const compactGap = hasLayout ? '\n@media (max-width: 40rem) { #menu .menu-list { gap: 12px 16px; } }' : ''
  return [serializeRules(rules), mobileMedia(serializeRules(mobileRules) + compactGap)].filter(Boolean).join('\n')
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
