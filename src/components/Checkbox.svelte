<script lang="ts">
import type { CheckboxProps } from '../types/types.ts'

const { id, label, checked = false, disabled = false, oninput }: CheckboxProps = $props()
</script>

<label
  for={id}
  class="mb-3 flex min-h-12 cursor-pointer items-center gap-3 rounded-lg border border-slate-700 bg-slate-800/50 px-3 py-3 text-sm text-slate-200 transition-colors hover:border-slate-500 has-checked:border-blue-500/60 has-checked:bg-blue-950/40 has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-blue-400 has-disabled:cursor-not-allowed has-disabled:opacity-50">
  <span class="min-w-0 flex-1 leading-5">{label}</span>
  <span class="relative inline-flex shrink-0">
    <input {id} type="checkbox" role="switch" {checked} {disabled} {oninput} class="peer sr-only" />
    <span
      aria-hidden="true"
      class="h-6 w-11 rounded-full bg-slate-600 ring-1 ring-inset ring-white/10 transition-colors peer-checked:bg-blue-500 peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-blue-400 motion-reduce:transition-none"
    ></span>
    <span
      aria-hidden="true"
      class="pointer-events-none absolute top-0.5 left-0.5 size-5 rounded-full bg-white shadow-sm transition-transform peer-checked:translate-x-5 motion-reduce:transition-none"
    ></span>
  </span>
</label>
