import type { BlockCssRule, ContentType } from '../../types/types.ts'
import { getCssLength, getTextAlign } from '../shared/css.ts'

export function getCss(item: ContentType, selector: string): BlockCssRule[] {
  const style = item.style ?? {}
  const ratio = String(style.videoAspectRatio ?? '16 / 9')
  const fit = String(style.videoObjectFit ?? 'contain')
  return [
    { selector, declarations: [getTextAlign(style.textAlign)] },
    { selector: `${selector} .video-content`, declarations: [`max-width: ${getCssLength(style.videoMaxWidth) || '960px'};`] },
    { selector: `${selector} .video-heading`, declarations: [`font-size: ${getCssLength(style.videoHeadingSize) || '2rem'};`] },
    { selector: `${selector} figcaption`, declarations: [`font-size: ${getCssLength(style.videoCaptionSize) || '1rem'};`] },
    {
      selector: `${selector} .video-player`,
      declarations: [
        `aspect-ratio: ${['auto', '16 / 9', '4 / 3', '1 / 1', '9 / 16'].includes(ratio) ? ratio : '16 / 9'};`,
        `object-fit: ${['contain', 'cover', 'fill'].includes(fit) ? fit : 'contain'};`,
      ],
    },
    // Embedded players have no intrinsic ratio, so "Original" falls back to widescreen.
    { selector: `${selector} .video-embed`, declarations: [ratio === 'auto' ? 'aspect-ratio: 16 / 9;' : ''] },
  ]
}
