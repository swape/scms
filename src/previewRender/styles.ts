import type { PageType, ProjectType } from '../types/types.ts'

// add css vars from current project to the document root
export function applyProjectStyles(currentProject: ProjectType | null): void {
  if (!currentProject) {
    return
  }

  const allColors = currentProject.colors || {}
  const styleId = 'project-theme-styles'
  let styleTag = document.getElementById(styleId) as HTMLStyleElement | null

  if (!styleTag) {
    styleTag = document.createElement('style')
    styleTag.id = styleId
    document.head.appendChild(styleTag)
  }

  const rootVars: string[] = ['  color-scheme: light dark;']
  const darkModeVars: string[] = []

  for (const [key, value] of Object.entries(allColors)) {
    if (key.endsWith('_dark')) {
      continue
    }

    const lightValue = value.c
    const darkValue = allColors[`${key}_dark`]?.c || lightValue

    rootVars.push(`  --${key}: light-dark(${lightValue}, ${darkValue});`)
    darkModeVars.push(`  --${key}: ${darkValue};`)
  }

  styleTag.textContent = `:root {\n${rootVars.join('\n')}\n}\n\nbody.dark-mode {\n${darkModeVars.join('\n')}\n}`
}

export function applyPageStyles(selectedPage: PageType | null, darkMode: boolean): void {
  if (!selectedPage) {
    return
  }

  const styleId = 'page-theme-styles'
  let styleTag = document.getElementById(styleId) as HTMLStyleElement | null

  if (!styleTag) {
    styleTag = document.createElement('style')
    styleTag.id = styleId
    document.head.appendChild(styleTag)
  }

  const bodyVars: string[] = []

  for (const [key, value] of Object.entries(selectedPage.style || {})) {
    if (key === 'backgroundColor') {
      bodyVars.push(`background-color: var(--${value});`)
    } else if (key === 'textColor') {
      bodyVars.push(`color: var(--${value});`)
    }
  }

  styleTag.textContent = `body {\n${bodyVars.join('\n')}\n}`

  const body = document.body

  // add dark mode class to body if darkMode is true
  if (darkMode) {
    body.classList.add('dark-mode')
  } else {
    body.classList.remove('dark-mode')
  }
}
