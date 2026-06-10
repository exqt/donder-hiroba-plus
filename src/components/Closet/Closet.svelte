<script lang="ts">
  import { getContext, onMount } from 'svelte'
  import { Closet } from '../../lib/closet'
  import Button from '../Common/Button.svelte'
  import CostumePreset from './CostumePreset.svelte'
  import type { KisekaeReqData } from 'hiroba-js'
  import type { Writable } from 'svelte/store'

  const title: Writable<string> = getContext('title')
  let parts: number[][] = []
  let presets: KisekaeReqData[] = []
  let closet: Closet | null = null
  $: updateCloset(presets)?.catch(() => {})

  onMount(async () => {
    title.set('Closet++')
    parts = await fetchCostumeParts()
    closet = await Closet.getInstance()
    presets = [...closet.presets]
    window.scrollTo(0, 0)
  })

  async function fetchCostumeParts (): Promise<number[][]> {
    const response = await fetch('https://donderhiroba.jp/mypage_kisekae.php')
    const html = await response.text()

    const dom = new DOMParser().parseFromString(html, 'text/html')
    const ids = [
      'tab-cos-kigu',
      'tab-cos-head',
      'tab-cos-body',
      'tab-cos-make',
      'tab-cos-acce'
    ]

    const parts: number[][] = [[], [], [], [], []]
    ids.forEach((id, i) => {
      dom
        .getElementById(id)
        ?.querySelectorAll('ul > li > a')
        ?.forEach((e) => {
          const num = Number(e.getAttribute('name'))
          if (!Number.isNaN(num)) {
            parts[i].push(num)
          }
        })
    })

    return parts
  }

  async function addPreset (): Promise<void> {
    presets = [...presets, {
      color: {
        body: 1,
        face: 0,
        limb: 3
      },
      costume: {
        kigurumi: 0,
        head: 0,
        body: 0,
        face: 0,
        petitCharacter: 0
      }
    }]
  }

  async function updateCloset (presets: KisekaeReqData[]): Promise<void> {
    if (closet === null) return
    closet.presets = [...presets]
    await closet.save()
  }
</script>

<div class="container">
  {#if closet}
    {#each presets as preset, index}
      <CostumePreset
        bind:preset
        {parts}
        remove={() => {
          presets = presets.filter((_, i) => i !== index)
        }}
      />
    {/each}
    <Button on:click={addPreset}>Add preset</Button>
  {:else}
    Loading...
  {/if}
</div>

<style>
  .container {
    display: flex;
    flex-direction: column;
    width: 100%;
    max-width: 300px;
    row-gap: 10px;
    margin-top: 5px;
  }
</style>
