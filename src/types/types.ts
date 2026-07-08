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
  key: string
  name: string
}
export interface ProjectType {
  id: string | number
  title: string
  description: string
  url: string
  pages: PageType[]

  colors?: {
    [key: string]: ColorType
  }
  users?: {
    [key: string]: 'owner' | 'editor' | 'viewer'
  }
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
