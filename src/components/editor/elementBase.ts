import type { ContentType } from '../../types/types'
import { blockDivider, blockText } from '../../constants'

export function newBlockElement(name: string, additionalProps: Partial<ContentType> = {}): ContentType {
  if (name === 'blockText') {
    return { ...blockText, ...additionalProps } as ContentType
  } else if(name === 'blockDivider') {
    return { ...blockDivider, ...additionalProps } as ContentType
  }

  return { type: name, ...additionalProps } as ContentType
}
