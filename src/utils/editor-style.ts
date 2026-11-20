import { getContext } from 'svelte'
import type { StyleEditor } from '../types/types.ts'

export const STYLE_EDITOR_CONTEXT = Symbol('style-editor')

export function getStyleEditor(): StyleEditor {
  const editor = getContext<StyleEditor>(STYLE_EDITOR_CONTEXT)
  if (!editor) {
    throw new Error('Style controls must be rendered inside the settings editor')
  }
  return editor
}
