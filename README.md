# scms

CMS from outer space

List of features:

- Front end in svelte and astro
- Back end in python and fastApi
- Database module with support for multiple databases (sqlite, postgres, firebase, supabase, etc)
- Authentication module with support for multiple authentication methods (jwt, oauth, firebase, supabase, etc)
- Docker support for all modules (frontend, backend, database, authentication)
- Support for publish to firebase hosting, github pages, vercel, netlify, etc
- Support for multiple languages (i18n)
- Support for multiple themes (light, dark, etc)
- Support for multiple users with different roles (admin, editor, viewer, etc)
- Support for both page-templates and page-builder
- Support for both markdown and wysiwyg editors
- Support for both static and dynamic content
- Support for import from other cms (wordpress, ghost, etc)
- Support for extract content from a url

List of technologies used:

- Front end: svelte, astro, tailwindcss, vite
- Back end: python, fastapi, uvicorn
- Database: sqlite, postgres, firebase, supabase
- Authentication: jwt, oauth, firebase, supabase
- Docker: docker, docker-compose
- Deployment: firebase hosting, github pages, vercel, netlify

All the modules are independent and can be used separately or together.
You can use the front end with your own hosted backend and database. Since they communicate via api and it is on its own docker files, you can choose what to pay for and what to host yourself.

The end product is static files that can be hosted anywhere. But can also have some dynamic content via backend api calls and serverless functions.

If supabase or firebase is used, the backend can be completely skipped and the front end can communicate directly with the database and authentication services.

But backend is still useful for server side rendering, custom api endpoints, webhooks, etc.

## Step by step guide to implement instructions from above

## TODO:

- [] Add top menu (with static and dynamic page listing)
- [] Add Footer component (with static and dynamic page listing)
- [] Add SEO component (with dynamic meta tags and social media tags)
- [] Add simple image block
- [] Add split block
- [] Add markdown block
- [] Add iframe block
- [] Add image gallery block

## How to add a new block

Each block lives in its own folder under `src/components/editor/blocks/` and consists of three files plus registration in the registry.

### 1. Create the block folder and files

Create `src/components/editor/blocks/block-<name>/` with three files:

**`definition.ts`** — defines the default data shape for the block:

```ts
import type { ContentType } from '../../../../types/types';

export const blockNameDefault = (
  extra: Partial<ContentType> = {}
): ContentType =>
  ({
    type: 'block-name',
    content: 'Default content',
    settings: {
      // block-specific settings fields
    },
    options: {
      // static option lists used in Settings.svelte (e.g. elementTypes)
    },
    styles: {
      marginTop: '',
      marginBottom: '',
      blockWidth: '',
      inlinePadding: '',
      blockPadding: '',
      borderRadius: '',
      textAlign: '',
      // add extra style keys as needed
    },
    colors: {
      textColorKey: '',
      backgroundColorKey: '',
    },
    parent: null,
    ...extra,
  }) as ContentType;
```

**`View.svelte`** — renders the block in the editor and on the page:

```svelte
<script>
  import InfoHelper from '../../elementView/InfoHelper.svelte';

  const { block } = $props();
  let blockStyles = $derived(
    `${block.styles?.marginTop || ''} ${block.styles?.marginBottom || ''} ${block.styles?.blockWidth || ''} ${block.styles?.inlinePadding || ''} ${block.styles?.blockPadding || ''} ${block.styles?.borderRadius || ''} ${block.styles?.textAlign || ''}`.trim()
  );
  let wrapperClass = $derived(`${block.styles?.blockWidth || ''}`.trim());
  let colors = $derived(
    `${block.colors?.textColorKey || ''} ${block.colors?.backgroundColorKey || ''}`.trim()
  );
</script>

<div
  class={`${colors} ${wrapperClass === 'block-width-full' ? '' : 'mx-auto container'} relative`}>
  <InfoHelper {block} />
  {#if block}
    <!-- render block content here -->
  {/if}
</div>
```

**`Settings.svelte`** — the editor sidebar form for the block's content and settings:

```svelte
<script lang="ts">
  import { untrack } from 'svelte';
  import InputWithLabel from '../../../editorParts/InputWithLabel.svelte';

  let { element, onChange } = $props();
  let localElement = $state(untrack(() => ({ ...element })));

  $effect(() => {
    localElement = { ...element };
  });
</script>

<InputWithLabel
  label="Content"
  inputType="text"
  bind:value={localElement.content}
  onchange={() => onChange(localElement)} />
<!-- add more editorParts inputs for block-specific settings -->
```

### 2. Register the block in `registry.ts`

Open `src/components/editor/blocks/registry.ts` and:

1. Import the three pieces at the top:

```ts
import { blockNameDefault } from './block-name/definition';
import BlockNameSettings from './block-name/Settings.svelte';
import BlockNameView from './block-name/View.svelte';
```

2. Add an entry to the `blockRegistry` array:

```ts
{
  type: 'block-name',
  label: 'My New Block',
  defaultData: blockNameDefault,
  SettingsComponent: BlockNameSettings,
  ViewComponent: BlockNameView,
},
```

### 3. Add style classes (optional)

If the block needs custom CSS utility classes, add them to `src/styles/blocks.css` following the naming convention already used there (e.g. `block-spacing-top-*`, `block-width-*`).

### 4. Add type fields (if needed)

If the block introduces new `styles` or `settings` keys not already covered by `ContentType`, extend the interface in `src/types/types.ts`.

### 5. Verify

Run `npm run check` to confirm there are no TypeScript or template errors, then `npm run dev` to test the block in the editor.
