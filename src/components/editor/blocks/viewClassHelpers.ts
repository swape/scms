import type { ContentType } from '../../../types/types'

type BlockViewData = Pick<ContentType, 'styles' | 'colors'> | null | undefined

export type BlockStyleKey = keyof NonNullable<ContentType['styles']>

export function extractBlockStyles(block: BlockViewData, styleKeys: BlockStyleKey[], extraClasses: Array<string | undefined> = []): string {
  const styleClasses = styleKeys.map((key) => block?.styles?.[key] || '')
  return [...styleClasses, ...extraClasses].filter(Boolean).join(' ').trim()
}

export function extractWrapperClass(block: Pick<ContentType, 'styles'> | null | undefined): string {
  return `${block?.styles?.blockWidth || ''}`.trim()
}
