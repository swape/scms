<script lang="ts">
import Input from '../../components/Input.svelte'
import { selectedElement } from '../../store.ts'
import type { BlockEditorProps, ContentType } from '../../types/types.ts'
import { updateBlockField } from '../shared/helpers.ts'
import ImageSource from '../shared/ImageSource.svelte'
import Styles from '../shared/Styles.svelte'
import TextAlign from '../shared/TextAlign.svelte'

const { updatePageContentWithDebounce, update, activeTab = 'content' }: BlockEditorProps = $props()

const selectedImage = $derived($selectedElement as ContentType)

function selectedFile(file: { name: string; size: string }) {
  update('title', file.name)
  update('size', file.size)
  updatePageContentWithDebounce()
}

function updateCaption(caption = '') {
  updateBlockField('caption', caption, update, updatePageContentWithDebounce)
}

function updateTitle(title = '') {
  updateBlockField('title', title, update, updatePageContentWithDebounce)
}
</script>

<div hidden={activeTab !== 'content'}>
  {#if selectedImage?.src}
    <div class="mb-3">
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

  <Input
    id="image-caption"
    label="Image Caption:"
    name="image-caption"
    type="text"
    placeholder="Image Caption"
    value={selectedImage?.caption || ''}
    onkeyup={({ target }) => updateCaption((target as HTMLInputElement).value)} />

  <ImageSource id="image-url" src={selectedImage?.src ?? ''} {update} onfile={selectedFile} clearKeys={['size']} />
</div>

<div hidden={activeTab !== 'style'}>
  <TextAlign title="Text Alignment" id="text-alignment" styleName="textAlign" />
  <TextAlign title="Image caption Alignment" id="image-caption-alignment" styleName="imageCaptionTextAlign" />
  <Styles allowCenter />
</div>
