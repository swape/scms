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
}

export interface ProjectType {
  id: string | number
  title: string
  description: string
  url: string
  pages?: PageType[]
  content?: ContentType[]
  colors?: {
    [key: string]: { c: string; key: string }
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
  children?: ContentType[]
}
export interface UserType {
  uid: string
  email: string
  displayName: string
  photoURL?: string
  token: string
}
