const pendingSaves = new Set<() => void>()

export function createPendingSave(delay: number) {
  let timeout: ReturnType<typeof setTimeout> | undefined
  let callback: (() => void) | undefined

  function cancel() {
    clearTimeout(timeout)
    timeout = undefined
    callback = undefined
    pendingSaves.delete(flush)
  }

  function flush() {
    const save = callback
    cancel()
    save?.()
  }

  function schedule(save: () => void) {
    cancel()
    callback = save
    pendingSaves.add(flush)
    timeout = setTimeout(flush, delay)
  }

  return { schedule, flush, cancel }
}

export function flushPendingEdits(): void {
  let failed = false
  let failure: unknown
  for (const flush of pendingSaves) {
    try {
      flush()
    } catch (error) {
      if (!failed) {
        failed = true
        failure = error
      }
    }
  }
  if (failed) {
    throw failure
  }
}
