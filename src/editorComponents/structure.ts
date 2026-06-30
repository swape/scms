export interface EditorPageType {
  id: string
  title: string
  path: string
  components: unknown[]
  parentId?: string | null
  order: number
}

type PagesListener = (nextPages: EditorPageType[]) => void
type SelectedPageListener = (nextPage: EditorPageType | null) => void

const pageListeners = new Set<PagesListener>()
const selectedPageListeners = new Set<SelectedPageListener>()
const proxiedPageObjects = new WeakSet<object>()

const mutatingArrayMethods = new Set(['copyWithin', 'fill', 'pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift'])

const isArrayIndex = (value: string): boolean => {
  const asNumber = Number(value)
  return Number.isInteger(asNumber) && asNumber >= 0
}

const notifyPagesChanged = () => {
  if (selectedPage && !pages.some((page) => page.id === selectedPage?.id)) {
    setSelectedPage(null)
  }

  for (const listener of pageListeners) {
    listener(pages)
  }
}

const notifySelectedPageChanged = () => {
  for (const listener of selectedPageListeners) {
    listener(selectedPage)
  }
}

const toReactivePage = (page: EditorPageType): EditorPageType => {
  if (proxiedPageObjects.has(page as object)) {
    return page
  }

  const reactivePage = new Proxy(page, {
    set(target, property, value, receiver) {
      const success = Reflect.set(target, property, value, receiver)
      if (success) {
        notifyPagesChanged()
      }
      return success
    },
    deleteProperty(target, property) {
      const success = Reflect.deleteProperty(target, property)
      if (success) {
        notifyPagesChanged()
      }
      return success
    },
  })

  proxiedPageObjects.add(reactivePage as object)
  return reactivePage
}

const makeReactivePages = (source: EditorPageType[]): EditorPageType[] => {
  const proxiedSource = source.map((page) => toReactivePage(page))

  return new Proxy(proxiedSource, {
    get(target, property, receiver) {
      const currentValue = Reflect.get(target, property, receiver)

      if (typeof currentValue === 'function' && mutatingArrayMethods.has(String(property))) {
        return (...args: unknown[]) => {
          let preparedArgs = args

          if (property === 'push' || property === 'unshift') {
            preparedArgs = args.map((item) => toReactivePage(item as EditorPageType))
          }

          if (property === 'splice' && args.length > 2) {
            preparedArgs = [...args]
            for (let index = 2; index < preparedArgs.length; index += 1) {
              preparedArgs[index] = toReactivePage(preparedArgs[index] as EditorPageType)
            }
          }

          const result = Reflect.apply(currentValue, target, preparedArgs)
          notifyPagesChanged()
          return result
        }
      }

      return currentValue
    },
    set(target, property, value, receiver) {
      const nextValue = typeof property === 'string' && isArrayIndex(property) ? toReactivePage(value as EditorPageType) : value

      const success = Reflect.set(target, property, nextValue, receiver)
      if (success) {
        notifyPagesChanged()
      }
      return success
    },
    deleteProperty(target, property) {
      const success = Reflect.deleteProperty(target, property)
      if (success) {
        notifyPagesChanged()
      }
      return success
    },
  })
}

export const globalSettings: unknown[] = []

export let selectedPage: EditorPageType | null = null

export const setSelectedPage = (nextPage: EditorPageType | null): void => {
  if (selectedPage?.id === nextPage?.id) {
    return
  }

  selectedPage = nextPage
  notifySelectedPageChanged()
}

export const pages = makeReactivePages([
  {
    title: 'Home',
    path: '/',
    components: [],
    id: 'initial first page',
    parentId: null,
    order: 0,
  },
])

export const onPagesChange = (listener: PagesListener): (() => void) => {
  pageListeners.add(listener)
  listener(pages)

  return () => {
    pageListeners.delete(listener)
  }
}

export const onSelectedPageChange = (listener: SelectedPageListener): (() => void) => {
  selectedPageListeners.add(listener)
  listener(selectedPage)

  return () => {
    selectedPageListeners.delete(listener)
  }
}
