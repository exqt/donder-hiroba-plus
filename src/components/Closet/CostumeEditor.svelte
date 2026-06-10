<script lang="ts">
  import type { KisekaeReqData } from 'hiroba-js'
  import Button from '../Common/Button.svelte'

  export let preset: KisekaeReqData
  export let parts: number[][]
  export let show: boolean

  const costumeSections = [
    'kigurumi',
    'head',
    'body',
    'face',
    'petitCharacter'
  ] as const
  let section: 'color' | 'costume' = 'color'
  let colorSection: 'body' | 'limb' | 'face' = 'face'
  let costumeSection: 'kigurumi' | 'head' | 'body' | 'face' | 'petitCharacter' =
    'kigurumi'
  $: costumeSectionIndex = getCostumeSectionIndex(costumeSection)
  $: groupedParts = getGroupedParts(costumeSectionIndex)

  function getCostumeSectionIndex (
    costumeSection: 'kigurumi' | 'head' | 'body' | 'face' | 'petitCharacter'
  ): number {
    return costumeSections.indexOf(costumeSection)
  }

  function getGroupedParts (costumeSectionIndex: number): number[][] {
    const grouped = Object.groupBy(parts[costumeSectionIndex], (_, i) =>
      Math.floor(i / 6)
    ) as Record<number, number[]> & { length: number }
    grouped.length = Object.keys(grouped).length
    return Array.from(grouped as Record<number, number[]> & { length: number })
  }

  const colors = [
    [
      { title: 0, color: '#F84828' },
      { title: 1, color: '#68C0C0' },
      { title: 2, color: '#DC1500' },
      { title: 3, color: '#F8F0E0' },
      { title: 4, color: '#009687' },
      { title: 5, color: '#00BF87' },
      { title: 6, color: '#00FF9A' },
      { title: 7, color: '#66FFC2' },
      { title: 8, color: '#FFFFFF' }
    ],
    [
      { title: 9, color: '#690000' },
      { title: 10, color: '#FF0000' },
      { title: 11, color: '#FF6666' },
      { title: 12, color: '#FFB3B3' },
      { title: 13, color: '#00BCC2' },
      { title: 14, color: '#00F7FF' },
      { title: 15, color: '#66FAFF' },
      { title: 16, color: '#B3FDFF' },
      { title: 17, color: '#E4E4E4' }
    ],
    [
      { title: 18, color: '#993800' },
      { title: 19, color: '#FF5E00' },
      { title: 20, color: '#FF9E78' },
      { title: 21, color: '#FFCFB3' },
      { title: 22, color: '#005199' },
      { title: 23, color: '#0088FF' },
      { title: 24, color: '#66B8FF' },
      { title: 25, color: '#B3DBFF' },
      { title: 26, color: '#B9B9B9' }
    ],
    [
      { title: 27, color: '#B37700' },
      { title: 28, color: '#FFAA00' },
      { title: 29, color: '#FFCC66' },
      { title: 30, color: '#FFE2B3' },
      { title: 31, color: '#000C80' },
      { title: 32, color: '#0019FF' },
      { title: 33, color: '#6675FF' },
      { title: 34, color: '#B3BAFF' },
      { title: 35, color: '#858585' }
    ],
    [
      { title: 36, color: '#B39B00' },
      { title: 37, color: '#FFDD00' },
      { title: 38, color: '#FFFF00' },
      { title: 39, color: '#FFFF71' },
      { title: 40, color: '#2B0080' },
      { title: 41, color: '#5500FF' },
      { title: 42, color: '#9966FF' },
      { title: 43, color: '#CCB3FF' },
      { title: 44, color: '#505050' }
    ],
    [
      { title: 45, color: '#38A100' },
      { title: 46, color: '#78C900' },
      { title: 47, color: '#B3FF00' },
      { title: 48, color: '#DCFF8A' },
      { title: 49, color: '#610080' },
      { title: 50, color: '#C400FF' },
      { title: 51, color: '#DC66FF' },
      { title: 52, color: '#EDB3FF' },
      { title: 53, color: '#232323' }
    ],
    [
      { title: 54, color: '#006600' },
      { title: 55, color: '#00B800' },
      { title: 56, color: '#00FF00' },
      { title: 57, color: '#8AFF9E' },
      { title: 58, color: '#990059' },
      { title: 59, color: '#FF0095' },
      { title: 60, color: '#FF66BF' },
      { title: 61, color: '#FFB3DF' },
      { title: 62, color: '#000000' }
    ]
  ]
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->

<div class="container" style:display={show ? 'flex' : 'none'}>
  <div class="section-selector">
    <Button
      on:click={() => {
        section = 'color'
      }}>Color</Button
    >
    <Button
      on:click={() => {
        section = 'costume'
      }}>Costume</Button
    >
  </div>
  {#if section === 'color'}
    <select bind:value={colorSection}>
      <option value="face">Face</option>
      <option value="body">Body</option>
      <option value="limb">Hands</option>
    </select>
    <div class="color-container">
      {#each colors as row}
        <div class="color-row">
          {#each row as color}
            <div
              class="color"
              style:background-color={color.color}
              on:click={() => {
                preset.color[colorSection] = color.title
              }}
            ></div>
          {/each}
        </div>
      {/each}
    </div>
  {:else}
    <select bind:value={costumeSection}>
      <option value="kigurumi">Kigurumi</option>
      <option value="head">Head</option>
      <option value="body">Body</option>
      <option value="face">Makeup</option>
      <option value="petitCharacter">Puchi Character</option>
    </select>
    <div class="parts-container">
      {#each groupedParts as row}
        <div class="parts-row">
          {#each row as part ([costumeSection, part])}
            <div
              class="part"
              on:click={() => {
                preset.costume[costumeSection] = part
              }}
            >
              <img
                src={`imgsrc_kisekae.php?cos=${part}&type=${costumeSectionIndex + 1}`}
                alt="part"
              />
            </div>
          {/each}
        </div>
      {/each}
    </div>
  {/if}
</div>

<style>
  .container{
    display:flex;
    flex-direction: column;
    align-items: center;
  }

  .section-selector {
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: center;

    & > * {
      width: 50%;
    }
  }

  .color-container {
    display: flex;
    flex-direction: column;
    row-gap: 2px;
    justify-content: center;
    align-items: center;
  }

  .color-row {
    display: flex;
    flex-direction: row;
    column-gap: 2px;
    justify-content: center;
    align-items: center;
  }

  .color {
    width: 27px;
    height: 27px;
    border: 1px solid black;
    cursor: pointer;
  }

  .parts-container {
    width: min-content;
    display: flex;
    flex-direction: column;
    align-items: center;
    row-gap: 5px;
  }
  .parts-row {
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    column-gap: 5px;
  }
  .part {
    width: 35px;
    height: 35px;
    border: 1px solid black;
    box-sizing: border-box;
    cursor: pointer;

    & img {
      width: 100%;
      height: 100%;
    }
  }

  select{
    margin-bottom: 5px;
  }
</style>
