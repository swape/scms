<script lang="ts">
import { resetAllStorage } from '../localstorage.ts'
import { userObj } from '../store.ts'
import type { UserType } from '../types/types.ts'
import Button from './Button.svelte'

let scms = window.localStorage.getItem('scms') || null
if (scms) {
  const jsonObj = JSON.parse(scms)
  if (jsonObj.uid) {
    $userObj = jsonObj
  }
}

function login() {
  const user: UserType = {
    token: '12345',
    uid: '123',
    displayName: 'Alireza Balouch',
    email: 'swape@swape.net',
  }
  window.localStorage.setItem('scms', JSON.stringify(user))
  $userObj = user
}

function signout() {
  resetAllStorage()
  $userObj = null
}
</script>

<div class="account-controls">
  {#if $userObj?.uid}
    <span class="account-name">Hello {$userObj.displayName}</span>
    <Button variant="ghost" size="sm" icon="logout" onclick={signout}>Sign out</Button>
  {/if}
  {#if !$userObj}
    <Button variant="primary" size="sm" icon="login" onclick={login}>Sign in</Button>
  {/if}
</div>

<style>
.account-controls {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
}
.account-name {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  color: var(--ui-muted);
}
@media (max-width: 600px) {
  .account-name {
    display: none;
  }
}
</style>
