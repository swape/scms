<script>
import { userObj } from '../store.js'

let scms = window.localStorage.getItem('scms') || null
if (scms) {
  const jsonObj = JSON.parse(scms)
  if (jsonObj.uid) {
    $userObj = jsonObj
  }
}

function login() {
  const user = {
    token: '12345',
    uid: 123,
    name: 'Alireza Balouch',
    email: 'swape@swape.net',
  }
  window.localStorage.setItem('scms', JSON.stringify(user))
  $userObj = user
}

function signout() {
  window.localStorage.setItem('scms', null)
  window.localStorage.clear()
  $userObj = null
}
</script>

<div class="flex gap-3 items-center flex-wrap">
  {#if $userObj?.uid}
    <span> Hello {$userObj.name}</span>
    <button onclick={signout} class="btn px-4 py-2">Sign out</button>
  {/if}
  {#if !$userObj}
    <button onclick={login} class="btn">Sign in</button>
  {/if}
</div>
