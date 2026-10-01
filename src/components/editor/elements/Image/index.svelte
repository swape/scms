<script lang="ts">
import { selectedElement } from '../../../../store.ts'
import type { ContentType } from '../../../../types/types.ts'
import FileSelector from '../../../FileSelector/index.svelte'
import TextAlign from '../../stylingParts/TextAlign.svelte'

const { updatePageContentWithDebounce, update } = $props()

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

<div class="input-and-label-wrapper">
  <label for="image-header">Image Header:</label>
  <input name="image-header" type="text" placeholder="Image Title" value={selectedImage?.title || ''} onkeyup={({ target }) => updateTitle((target as HTMLInputElement).value)} />
</div>

<TextAlign element={$selectedElement} {update} title="Text Alignment" id="text-alignment" styleName="textAlign" />

<div class="input-and-label-wrapper">
  <label for="image-caption">Image Caption:</label>
  <input
    name="image-caption"
    type="text"
    placeholder="Image Caption"
    value={selectedImage?.caption || ''}
    onkeyup={({ target }) => updateCaption((target as HTMLInputElement).value)} />
</div>

<TextAlign element={$selectedElement} {update} title="Image caption Alignment" id="text-alignment" styleName="imageCaptionTextAlign" />

<FileSelector selected={selectedFile} />
