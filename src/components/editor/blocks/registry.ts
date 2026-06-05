import type { Component } from 'svelte'
import type { ContentType } from '../../../types/types'
import { blockButtonDefault } from './block-button/definition'
import BlockButtonSettings from './block-button/Settings.svelte'
import BlockButtonView from './block-button/View.svelte'
import { blockDividerDefault } from './block-divider/definition'
import BlockDividerSettings from './block-divider/Settings.svelte'
import BlockDividerView from './block-divider/View.svelte'
import { blockLinkDefault } from './block-link/definition'
import BlockLinkSettings from './block-link/Settings.svelte'
import BlockLinkView from './block-link/View.svelte'
import { blockSplitDefault } from './block-split/definition'
import BlockSplitSettings from './block-split/Settings.svelte'
import BlockSplitView from './block-split/View.svelte'
import { blockTextDefault } from './block-text/definition'
import BlockTextSettings from './block-text/Settings.svelte'
import BlockTextView from './block-text/View.svelte'

export interface BlockDefinition {
  type: string
  label: string
  defaultData: (extra?: Partial<ContentType>) => ContentType
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  SettingsComponent: Component<any>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ViewComponent: Component<any>
}

export const blockRegistry: BlockDefinition[] = [
  {
    type: blockTextDefault().type,
    label: blockTextDefault().label ?? '',
    defaultData: blockTextDefault,
    SettingsComponent: BlockTextSettings,
    ViewComponent: BlockTextView,
  },
  {
    type: blockDividerDefault().type,
    label: blockDividerDefault().label ?? '',
    defaultData: blockDividerDefault,
    SettingsComponent: BlockDividerSettings,
    ViewComponent: BlockDividerView,
  },
  {
    type: blockButtonDefault().type,
    label: blockButtonDefault().label ?? '',
    defaultData: blockButtonDefault,
    SettingsComponent: BlockButtonSettings,
    ViewComponent: BlockButtonView,
  },
  {
    type: blockLinkDefault().type,
    label: blockLinkDefault().label ?? '',
    defaultData: blockLinkDefault,
    SettingsComponent: BlockLinkSettings,
    ViewComponent: BlockLinkView,
  },
  {
    type: blockSplitDefault().type,
    label: blockSplitDefault().label ?? '',
    defaultData: blockSplitDefault,
    SettingsComponent: BlockSplitSettings,
    ViewComponent: BlockSplitView,
  },
]

export function getBlockByType(type: string): BlockDefinition | undefined {
  return blockRegistry.find((b) => b.type === type)
}
