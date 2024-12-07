<script lang="ts">
  import { createEventDispatcher } from 'svelte'
  const dispatchEvent = createEventDispatcher()
  const agree = async (): Promise<void> => {
    dispatchEvent('agree')
  }
</script>

<span style="font-size: 30px;">
  ⚠️ Disclaimer
</span>

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

<style>
  p {
    margin: 0;
    margin-bottom: 8px;
  }
  a {
    color: rgb(159, 159, 255);
  }
</style>
