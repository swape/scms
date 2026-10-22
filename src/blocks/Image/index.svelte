<script lang="ts">
import FileSelector from '../../components/FileSelector/index.svelte'
import Input from '../../components/Input.svelte'
import { selectedElement } from '../../store.ts'
import type { BlockEditorProps, ContentType } from '../../types/types.ts'
import Margin from '../shared/Margin.svelte'
import Padding from '../shared/Padding.svelte'
import TextAlign from '../shared/TextAlign.svelte'
import TextAndBackgroundColors from '../shared/TextAndBackgroundColors.svelte'
import Wrapper from '../shared/Wrapper.svelte'

const { updatePageContentWithDebounce, update }: BlockEditorProps = $props()

const selectedImage = $derived($selectedElement as ContentType)

function selectedFile(file: { id: string; name: string; size: string; url: string; alt: string; type: string; parentFolder: string; caption: string }) {
  update('src', file.url)
  update('alt', file.alt)
  update('title', file.name)
  update('imageType', file.type)
  update('size', file.size)
  update('imageId', file.id)
  updatePageContentWithDebounce()
}

function updateCaption(caption = '') {
  update('caption', caption)
  updatePageContentWithDebounce()
}

function updateTitle(title = '') {
  update('title', title)
  updatePageContentWithDebounce()
}
</script>

{#if selectedImage?.src}
  <div class="mb-4">
    <img src={selectedImage.src} alt={selectedImage.alt} class="w-full h-auto rounded" />
  </div>
{/if}

<Input
  id="image-header"
  label="Image Header:"
  name="image-header"
  placeholder="Image Title"
  value={selectedImage?.title || ''}
  onkeyup={({ target }) => updateTitle((target as HTMLInputElement).value)} />

<TextAlign element={$selectedElement} {update} title="Text Alignment" id="text-alignment" styleName="textAlign" />

<Input
  id="image-caption"
  label="Image Caption:"
  name="image-caption"
  type="text"
  placeholder="Image Caption"
  value={selectedImage?.caption || ''}
  onkeyup={({ target }) => updateCaption((target as HTMLInputElement).value)} />

<TextAlign element={$selectedElement} {update} title="Image caption Alignment" id="image-caption-alignment" styleName="imageCaptionTextAlign" />

<FileSelector selected={selectedFile} />

<div class="mt-5 pt-5 border-t border-slate-700 mb-5 text-gray-500 text-sm">Styles:</div>
<Wrapper {updatePageContentWithDebounce} {update} allowCenter />
<TextAndBackgroundColors {updatePageContentWithDebounce} {update} />
<Padding {updatePageContentWithDebounce} {update} />
<Margin {updatePageContentWithDebounce} {update} />
