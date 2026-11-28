const vimeoHosts = new Set(['vimeo.com', 'www.vimeo.com', 'player.vimeo.com'])

export interface VimeoVideo {
  id: string
  hash?: string
}

export interface VimeoPlayback {
  autoplay: boolean
  loop: boolean
  muted: boolean
  controls: boolean
}

export function parseVimeoUrl(value: string | undefined): VimeoVideo | undefined {
  let url: URL
  try {
    url = new URL(value?.trim() ?? '')
  } catch {
    return undefined
  }
  if (url.protocol !== 'https:' && url.protocol !== 'http:') {
    return undefined
  }
  if (!vimeoHosts.has(url.hostname.toLowerCase())) {
    return undefined
  }

  const segments = url.pathname.split('/').filter(Boolean)
  const queryHash = url.searchParams.get('h') ?? undefined
  // Plain, channel, group, and player URLs all end in a numeric ID. Unlisted
  // videos add a private hash either as the next segment or as ?h=.
  const idIndex = segments.findIndex((segment) => /^\d+$/.test(segment))
  if (idIndex === -1) {
    return undefined
  }
  const id = segments[idIndex]
  const hash = segments[idIndex + 1] ?? queryHash
  return { id, hash: hash && /^[a-zA-Z0-9]+$/.test(hash) ? hash : undefined }
}

export function getVimeoEmbedUrl(video: VimeoVideo, playback: VimeoPlayback): string {
  const params = new URLSearchParams()
  if (video.hash) {
    params.set('h', video.hash)
  }
  params.set('dnt', '1')
  params.set('playsinline', '1')
  if (playback.autoplay) {
    params.set('autoplay', '1')
  }
  if (playback.loop) {
    params.set('loop', '1')
  }
  if (playback.muted || playback.autoplay) {
    params.set('muted', '1')
  }
  if (!playback.controls) {
    params.set('controls', '0')
  }
  return `https://player.vimeo.com/video/${video.id}?${params}`
}
