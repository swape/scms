export interface PageType {
  id: string
  parentId: string | null
  title: string
  order: number
  type: string
  colors?: {
    textColorKey: string
    backgroundColorKey: string
  }
  content: ContentType[]
  style?: {
    [key: string]: string | number
  }
}

export interface ColorType {
  c: string
  cDark: string
  key: string
  name: string
}
export interface ProjectType {
  id: string | number
  title: string
  description: string
  url: string
  pages: PageType[]
  colors?: ColorType[]
  users?: {
    [key: string]: 'owner' | 'editor' | 'viewer'
  }
  extra: {
    head: string
    style: string
  }
  menu: {
    type: 'menu1' // this is the first menu style, we can add more menu styles later
    elements: MenuElement[]
  }
  footer: {
    type: 'footer1' // this is the first footer style, we can add more footer styles later
    elements: FooterElement[]
    style?: {
      [key: string]: string | number
    }
  }
}

export interface MenuElement {
  type: 'link' | 'dropdown' | 'auto' // auto lists all sub-pages in selected parent page
  title: string
  link?: LinkSettings
  children?: MenuElement[]
  autoParentPageId?: string // if type is auto, this is the parent page id to list sub-pages
  autoMaxItems?: number // if type is auto, this is the max number of items to list
}

export interface ContentType {
  id: string | number
  order: number
  parent: string | null
  pageId: string
  title: string // name of the element
  type: string // element type
  style?: {
    [key: string]: string | number
  }
  content?: string
  // link element
  link?: LinkSettings
  // header element
  headerLevel?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
}

export type FooterElementType = 'link' | 'social' | 'html' | 'text'
export type SocialPlatform = 'facebook' | 'twitter' | 'instagram' | 'linkedin' | 'github' | 'youtube'

export interface FooterElement {
  id: string
  type: FooterElementType
  title: string
  link?: LinkSettings
  socialPlatform?: SocialPlatform
  html?: string
  text?: string
}

export type LinkMode = 'url' | 'page'
export type LinkTarget = '_self' | '_blank'

export interface LinkSettings {
  text: string
  mode: LinkMode
  url: string
  pageId: string
  target: LinkTarget
  asButton: boolean
}
export interface UserType {
  uid: string
  email: string
  displayName: string
  photoURL?: string
  token: string
}
