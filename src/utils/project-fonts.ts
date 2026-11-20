import type { ProjectType } from '../types/types.ts'

const variants = {
  variableItalic: ':ital,wght@0,400..700;1,400..700',
  variable: ':wght@400..700',
  staticItalic: ':ital,wght@0,400;0,700;1,400;1,700',
  regularItalic: ':ital@0;1',
} as const

// First ten Latin-capable families per category by Google Fonts metadata popularity.
export const projectFontGroups = [
  {
    label: 'Sans serif',
    fallback: 'sans-serif',
    fonts: [
      ['Roboto', 'variableItalic'],
      ['Open Sans', 'variableItalic'],
      ['Google Sans', 'variableItalic'],
      ['Inter', 'variableItalic'],
      ['Montserrat', 'variableItalic'],
      ['Poppins', 'staticItalic'],
      ['Lato', 'staticItalic'],
      ['Noto Sans JP', 'variable'],
      ['Arimo', 'variableItalic'],
      ['Roboto Condensed', 'variableItalic'],
    ],
  },
  {
    label: 'Serif',
    fallback: 'serif',
    fonts: [
      ['Playfair Display', 'variableItalic'],
      ['Roboto Slab', 'variable'],
      ['Merriweather', 'variableItalic'],
      ['Lora', 'variableItalic'],
      ['Cormorant Garamond', 'variableItalic'],
      ['Noto Serif', 'variableItalic'],
      ['Libre Baskerville', 'variableItalic'],
      ['Instrument Serif', 'regularItalic'],
      ['Fraunces', 'variableItalic'],
      ['PT Serif', 'staticItalic'],
    ],
  },
] as const

const fonts = new Map(projectFontGroups.flatMap(({ fallback, fonts }) => fonts.map(([name, variant]) => [String(name), { fallback, variant: variants[variant] }] as const)))

const headMarkers = ['<!-- SCMS project fonts -->', '<!-- /SCMS project fonts -->'] as const
const styleMarkers = ['/* SCMS project fonts */', '/* /SCMS project fonts */'] as const
const headingSelector = 'h1, h2, h3, h4, h5, h6'

function managedBlock(text: string, [open, close]: readonly [string, string]) {
  const start = text.indexOf(open)
  const end = start === -1 ? -1 : text.indexOf(close, start + open.length)
  return end === -1 ? null : { start, end: end + close.length, contents: text.slice(start + open.length, end) }
}

function updateBlock(text: string, markers: readonly [string, string], contents: string) {
  const current = managedBlock(text, markers)
  const next = contents ? `${markers[0]}\n${contents}\n${markers[1]}` : ''
  if (!current) {
    return next ? (text ? `${text}\n\n${next}` : next) : text
  }
  const before = text.slice(0, current.start)
  const prefix = !next && before.endsWith('\n\n') ? before.slice(0, -2) : before
  return `${prefix}${next}${text.slice(current.end)}`
}

export function readProjectFonts(style: string) {
  const contents = managedBlock(style, styleMarkers)?.contents ?? ''
  function readFont(selector: string) {
    const name = contents.split(`\n${selector} {\n  font-family: "`)[1]?.split('"')[0] ?? ''
    return fonts.has(name) ? name : ''
  }
  return { headings: readFont(headingSelector), body: readFont('body') }
}

export function updateProjectFonts(extra: ProjectType['extra'], selections: ReturnType<typeof readProjectFonts>): ProjectType['extra'] {
  const families = [...new Set([selections.headings, selections.body].filter((name) => fonts.has(name)))].sort()
  const query = families.map((name) => `family=${name.replaceAll(' ', '+')}${fonts.get(name)?.variant}`).join('&amp;')
  const link = query ? `<link rel="stylesheet" href="https://fonts.googleapis.com/css2?${query}&amp;display=swap">` : ''

  function rule(selector: string, name: string) {
    const font = fonts.get(name)
    return font ? `${selector} {\n  font-family: "${name}", ${font.fallback};\n}` : ''
  }

  const styles = [rule('body', selections.body), rule(headingSelector, selections.headings)].filter(Boolean).join('\n\n')
  return { head: updateBlock(extra.head, headMarkers, link), style: updateBlock(extra.style, styleMarkers, styles) }
}
