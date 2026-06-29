import type { Component } from 'svelte'
import { blockMeta, type BlockMeta } from './blockMeta'
import BlockButtonSettings from './block-button/Settings.svelte'
import BlockButtonView from './block-button/View.svelte'
import BlockDividerSettings from './block-divider/Settings.svelte'
import BlockDividerView from './block-divider/View.svelte'
import BlockLinkSettings from './block-link/Settings.svelte'
import BlockLinkView from './block-link/View.svelte'
import BlockSplitSettings from './block-split/Settings.svelte'
import BlockSplitView from './block-split/View.svelte'
import BlockTextSettings from './block-text/Settings.svelte'
import BlockTextView from './block-text/View.svelte'

export type { BlockMeta }

export interface BlockDefinition extends BlockMeta {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  SettingsComponent: Component<any>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ViewComponent: Component<any>
}

const settingsComponents = [BlockTextSettings, BlockDividerSettings, BlockButtonSettings, BlockLinkSettings, BlockSplitSettings]
const viewComponents = [BlockTextView, BlockDividerView, BlockButtonView, BlockLinkView, BlockSplitView]

export const blockRegistry: BlockDefinition[] = blockMeta.map((meta, i) => ({
  ...meta,
  SettingsComponent: settingsComponents[i],
  ViewComponent: viewComponents[i],
}))

export function getBlockByType(type: string): BlockDefinition | undefined {
  return blockRegistry.find((b) => b.type === type)
}
