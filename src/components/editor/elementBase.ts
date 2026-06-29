import type { ContentType } from '../../types/types.ts'
import { blockRegistry } from './blocks/registry'

export function newBlockElement(type: string, additionalProps: Partial<ContentType> = {}): ContentType {
  const def = blockRegistry.find((b) => b.type === type)
  if (def) {
    return def.defaultData(additionalProps)
  }
  return { type, ...additionalProps } as ContentType
}
