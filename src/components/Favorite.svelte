<script lang="ts">
  import { sendRequest } from '../lib/favorite'
  import Button from './Common/Button.svelte'

  export let tckt: string

  const save = async (): Promise<void> => {
    await sendRequest([], tckt)

    window.location.href = 'https://donderhiroba.jp/mypage_top.php'
  }
</script>

<div>
  favorite
</div>
