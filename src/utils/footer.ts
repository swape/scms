import { projects } from '../store'
import type { FooterElement, ProjectType, SocialPlatform } from '../types/types'

export function createFooterLink(title: string = 'New link'): FooterElement {
  return {
    id: String(Date.now()),
    type: 'link',
    title,
    link: {
      text: title,
      mode: 'url',
      url: '',
      pageId: '',
      target: '_self',
      asButton: false,
    },
  }
}

export function createFooterSocial(platform: SocialPlatform): FooterElement {
  return {
    id: String(Date.now()),
    type: 'social',
    title: platform,
    socialPlatform: platform,
    link: {
      text: platform,
      mode: 'url',
      url: '',
      pageId: '',
      target: '_blank',
      asButton: false,
    },
  }
}

export function createFooterText(text: string = ''): FooterElement {
  return {
    id: String(Date.now()),
    type: 'text',
    title: 'Text block',
    text,
  }
}

export function createFooterHtml(html: string = ''): FooterElement {
  return {
    id: String(Date.now()),
    type: 'html',
    title: 'Custom HTML',
    html,
  }
}

export function saveFooterToProject(projectId: string | number, footer: ProjectType['footer']): void {
  projects.update((items) => {
    if (!items) {
      return items
    }
    return items.map((p) => {
      if (p.id === projectId) {
        return { ...p, footer }
      }
      return p
    })
  })
}
