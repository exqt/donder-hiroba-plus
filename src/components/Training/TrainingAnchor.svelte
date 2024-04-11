<script lang="ts">
  import Button from '../Common/Button.svelte'

  function gotoTraining (): void {
    const url = new URL(window.location.origin)
    url.hash = '#/training'
    window.location.href = url.href
  }
</script>

<Button on:click={gotoTraining}>
  <div style="width:290px;">훈련</div>
</Button>
