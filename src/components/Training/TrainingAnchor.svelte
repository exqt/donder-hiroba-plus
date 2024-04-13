<script lang="ts">
  import I18N from '../../lib/i18n'
  import Button from '../Common/Button.svelte'

  function gotoTraining (): void {
    const url = new URL(window.location.origin)
    url.hash = '#/training'
    window.location.href = url.href
  }
</script>

{#await I18N.getInstance() then i18n}
  <Button on:click={gotoTraining}>
    <div style="width:290px;">{i18n.t('訓練')}</div>
  </Button>
{/await}
