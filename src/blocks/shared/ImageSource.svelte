<script lang="ts">
import FileSelector from '../../components/FileSelector/index.svelte'
import Input from '../../components/Input.svelte'
import type { BlockEditorProps } from '../../types/types.ts'

interface SelectedFile {
  id: string
  name: string
  size: string
  url: string
  alt: string
  type: string
  parentFolder: string
  caption: string
}

interface Props {
  id: string
  src?: string
  update: BlockEditorProps['update']
  onfile?: (file: SelectedFile) => void
  clearKeys?: string[]
}

const { id, src = '', update, onfile, clearKeys = [] }: Props = $props()

function selectFile(file: SelectedFile) {
  update('src', file.url)
  update('alt', file.alt)
  update('imageType', file.type)
  update('imageId', file.id)
  onfile?.(file)
}
</script>

<FileSelector selected={selectFile} />
<Input
  {id}
  label="Custom image URL:"
  value={src}
  oninput={(event) => {
    update('src', event.currentTarget.value.trim())
    update('imageId', '')
    update('imageType', '')
    for (const key of clearKeys) {
      update(key, '')
    }
  }} />
