<script lang="ts">
  import { DonderHiroba, type KisekaeReqData } from 'hiroba-js'
  import Button from '../Common/Button.svelte'
  import CostumeEditor from './CostumeEditor.svelte'

  export let preset: KisekaeReqData
  export let parts: number[][]
  export let remove: () => any

  let editorOpened = false
  $: costumeUrl = getCostumeURL(preset)

  function getCostumeURL (preset: KisekaeReqData): string {
    const url = new URL('https://donderhiroba.jp/imgsrc_mydon.php')
    url.searchParams.set('face', preset.color.face.toString())
    url.searchParams.set('body', preset.color.body.toString())
    url.searchParams.set('limb', preset.color.limb.toString())
    url.searchParams.set('cos1', preset.costume.kigurumi.toString())
    url.searchParams.set('cos2', preset.costume.head.toString())
    url.searchParams.set('cos3', preset.costume.body.toString())
    url.searchParams.set('cos4', preset.costume.face.toString())
    url.searchParams.set('cos5', preset.costume.petitCharacter.toString())

    return url.href
  }
</script>

<div class="container">
  <div class="preview">
    <div class="left">
      <img src={costumeUrl} alt="costume" />
    </div>
    <div class="right">
      <Button
        on:click={async () => {
          await DonderHiroba.func.changeKisekae({ kisekae: preset }).then(() => { alert('Applied successfully.') })
        }}
      >
        <div style="width:80px;">Apply</div>
      </Button>
      <Button
        on:click={() => {
          editorOpened = !editorOpened
        }}
      >
        <div style="width:80px;">Edit</div>
      </Button>
      <Button
        on:click={() => {
          preset.costume.kigurumi = 0
          preset.costume.head = 0
          preset.costume.body = 0
          preset.costume.face = 0
          preset.costume.petitCharacter = 0
        }}
      >
        <div style="width:80px;">Reset</div>
      </Button>
      <Button
        on:click={() => {
          if (confirm('Are you sure?')) {
            remove()
          }
        }}
      >
        <div style="width:80px;">Remove</div>
      </Button>
    </div>
  </div>
  <CostumeEditor bind:preset {parts} show={editorOpened} />
</div>

<style>
  .container {
    width: 100%;
    background-color: white;
    border-radius: 10px;

    box-sizing: border-box;
    padding: 5px;
  }

  .preview {
    display: flex;
    flex-direction: row;
  }

  .left,
  .right {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  .right {
    flex: 1 1 auto;
  }

  img {
    width: 150px;
    height: 150px;
  }
</style>
