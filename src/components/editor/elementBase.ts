import { blockButton, blockDivider, blockLink, blockText } from '../../constants'
import type { ContentType } from '../../types/types'

export function newBlockElement(name: string, additionalProps: Partial<ContentType> = {}): ContentType {
  if (name === 'blockText') {
    return { ...blockText, ...additionalProps } as ContentType
  } else if (name === 'blockDivider') {
    return { ...blockDivider, ...additionalProps } as ContentType
  } else if (name === 'blockButton') {
    return { ...blockButton, ...additionalProps } as ContentType
  } else if (name === 'blockLink') {
    return { ...blockLink, ...additionalProps } as ContentType
  }

  return { type: name, ...additionalProps } as ContentType
}
