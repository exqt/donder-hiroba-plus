<script lang="ts">
  import { createEventDispatcher } from 'svelte'
  const dispatchEvent = createEventDispatcher()
  const agree = async (): void => {
    dispatchEvent('agree')
  }
</script>

<p>
  This is unofficial chrome extension for
  <a href="https://donderhiroba.jp">donderhiroba.jp</a>.
</p>
<p>
  This extension might violate the <a href="https://donderhiroba.jp/other_agreement.php">terms of service</a> of donderhiroba.jp.
</p>
<p>
  Use this extension at your own risk.
  The developer of this extension is not responsible for any problems caused by using this extension.
</p>
<p>
  By clicking the button below, you agree to the above.
</p>
<button on:click={agree}>I agree</button>
