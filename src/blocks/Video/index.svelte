<script lang="ts">
import Checkbox from '../../components/Checkbox.svelte'
import FileSelector from '../../components/FileSelector/index.svelte'
import Input from '../../components/Input.svelte'
import PanelSection from '../../components/PanelSection.svelte'
import Select from '../../components/Select.svelte'
import SizeInput from '../../components/SizeInput.svelte'
import Textarea from '../../components/Textarea.svelte'
import { selectedElement } from '../../store.ts'
import type { BlockEditorProps, ContentType } from '../../types/types.ts'
import { getStyleEditor } from '../../utils/editor-style.ts'
import HeaderSizeSelect from '../shared/HeaderSizeSelect.svelte'
import Styles from '../shared/Styles.svelte'
import TextAlign from '../shared/TextAlign.svelte'

const { update, activeTab = 'content' }: BlockEditorProps = $props()
const block = $derived($selectedElement as ContentType)
const style = getStyleEditor()
</script>

<div hidden={activeTab !== 'content'}>
  <PanelSection title="Content">
    <Input id="video-title" label="Title:" value={block?.title ?? ''} oninput={(event) => update('title', event.currentTarget.value)} />
    <Input
      id="video-src"
      label="Video URL:"
      hint="Use a direct video file URL (MP4 or WebM) or a Vimeo link, including unlisted links. YouTube page URLs are not supported. Vimeo videos use their own thumbnail, so the poster image only applies to direct files."
      placeholder="https://vimeo.com/123456789 or https://example.com/video.mp4"
      value={block?.src ?? ''}
      oninput={(event) => update('src', event.currentTarget.value)} />
    <FileSelector selected={(file: { url: string }) => update('poster', file.url)} />
    <Input
      id="video-poster"
      label="Custom poster image URL:"
      hint="Optional image shown before playback begins."
      value={block?.poster ?? ''}
      oninput={(event) => update('poster', event.currentTarget.value)} />
    <Textarea
      id="video-caption"
      label="Caption:"
      rows="3"
      hint="Optional description displayed below the video; this is not a timed subtitles track."
      value={block?.caption ?? ''}
      oninput={(event) => update('caption', event.currentTarget.value)} />
  </PanelSection>
</div>

<div hidden={activeTab !== 'style'}>
  <TextAlign title="Content alignment" id="video-alignment" styleName="textAlign" />
  <Styles sections={['wrapper', 'custom', 'colors', 'padding', 'margin']}>
    {#key `${block?.id}:${style.mode}`}
      <SizeInput
        id="video-width"
        label="Maximum width:"
        min="0"
        fallback="960px"
        value={style.read('videoMaxWidth')}
        onvaluechange={(value) => style.set('videoMaxWidth', value)} />
      <SizeInput
        id="video-heading-size"
        label="Heading size:"
        min="0"
        defaultUnit="rem"
        fallback="2rem"
        value={style.read('videoHeadingSize')}
        onvaluechange={(value) => style.set('videoHeadingSize', value)} />
      <SizeInput
        id="video-caption-size"
        label="Caption size:"
        min="0"
        defaultUnit="rem"
        fallback="1rem"
        value={style.read('videoCaptionSize')}
        onvaluechange={(value) => style.set('videoCaptionSize', value)} />
    {/key}
    <Select
      id="video-aspect-ratio"
      label="Aspect ratio:"
      value={style.read('videoAspectRatio') ?? '16 / 9'}
      onchange={(event) => style.set('videoAspectRatio', event.currentTarget.value)}>
      <option value="auto">Original</option>
      <option value="16 / 9">Widescreen (16:9)</option>
      <option value="4 / 3">Standard (4:3)</option>
      <option value="1 / 1">Square (1:1)</option>
      <option value="9 / 16">Portrait (9:16)</option>
    </Select>
    <Select id="video-object-fit" label="Video fit:" value={style.read('videoObjectFit') ?? 'contain'} onchange={(event) => style.set('videoObjectFit', event.currentTarget.value)}>
      <option value="contain">Contain (show whole video)</option>
      <option value="cover">Cover (crop to fill)</option>
      <option value="fill">Stretch to fill</option>
    </Select>
  </Styles>
</div>

<div hidden={activeTab !== 'other'}>
  <PanelSection title="Playback">
    <Checkbox id="video-controls" label="Show native controls" checked={block?.videoControls ?? true} oninput={(event) => update('videoControls', event.currentTarget.checked)} />
    <Checkbox id="video-autoplay" label="Autoplay" checked={block?.videoAutoplay ?? false} oninput={(event) => update('videoAutoplay', event.currentTarget.checked)} />
    <Checkbox id="video-loop" label="Loop" checked={block?.videoLoop ?? false} oninput={(event) => update('videoLoop', event.currentTarget.checked)} />
    <Checkbox
      id="video-muted"
      label="Muted"
      checked={Boolean(block?.videoMuted || block?.videoAutoplay)}
      disabled={block?.videoAutoplay ?? false}
      oninput={(event) => update('videoMuted', event.currentTarget.checked)} />
    <p class="video-hint">
      Autoplay always starts muted to follow browser restrictions; browsers may still block it. In the editor, video is not preloaded and playback starts only when you use the
      native controls.
    </p>
  </PanelSection>
  <HeaderSizeSelect id="video-heading-level" value={block?.headerLevel ?? 'h2'} onchange={(level) => update('headerLevel', level)} />
</div>

<style>
.video-hint {
  margin: 0 0 0.75rem;
  color: var(--ui-muted, #b3b3b3);
  font-size: 0.75rem;
  line-height: 1.5;
}
</style>
