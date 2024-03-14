<script lang="ts">
  import Header from './Header.svelte'
  import { afterUpdate, onMount } from 'svelte'
  import type { SearchOptions } from '../../types'
  import type { Writable } from 'svelte/store'

  export let searchOptions: Writable<SearchOptions>

  // https://codepen.io/alexpg96/pen/xxrBgbP

  const min = 60
  const max = 109
  export let value1 = 60
  export let value2 = 109
  let sliderTrack: HTMLDivElement

  const onUpdate = (ev?: Event): void => {
    if (ev !== undefined) {
      const id = (ev.target as HTMLInputElement)?.id
      if (id === 'slider-1' && value1 >= value2) {
        value1 = value2 - 1
      } else if (id === 'slider-2' && value2 <= value1) {
        value2 = value1 + 1
      }
    }

    const percent1 = ((value1 - min) / (max - min)) * 100
    const percent2 = ((value2 - min) / (max - min)) * 100

    sliderTrack.style.background =
      `linear-gradient(
        to right,
        #dadae5 ${percent1}%,
        #3264fe ${percent1}%,
        #3264fe ${percent2}%,
        #dadae5 ${percent2}%)
      `
  }

  const onChange = (ev: Event): void => {
    const id = (ev.target as HTMLInputElement)?.id
    if (id === 'slider-1') {
      value1 = parseInt((ev.target as HTMLInputElement).value)
    } else if (id === 'slider-2') {
      value2 = parseInt((ev.target as HTMLInputElement).value)
    }

    searchOptions.update((options) => {
      options.minLevel = value1
      options.maxLevel = value2
      return options
    })
  }

  onMount(() => {
    onUpdate()
  })

  afterUpdate(() => {
    onUpdate()
  })

  const reset = (): void => {
    value1 = 60
    value2 = 109
    onUpdate()
  }
</script>

<div class="wrapper">
  <Header name="LEVEL" on:click={reset}/>
  <div class="values">
    <span id="range1">
      ★ {value1 === 60 ? '6.0↓' : (value1 / 10).toFixed(1)}
    </span>
    <span> &dash; </span>
    <span id="range2">
      {(value2 / 10).toFixed(1)}
    </span>
  </div>
  <div class="container">
    <div class="slider-track" bind:this={sliderTrack}></div>
    <input type="range" {min} {max} bind:value={value1} id="slider-1" on:input={onUpdate} on:change={onChange}>
    <input type="range" {min} {max} bind:value={value2} id="slider-2" on:input={onUpdate} on:change={onChange}>
  </div>
</div>

<style>
  .wrapper {
    position: relative;
    width: 100%;
    margin-top: 4px;
  }

  .container {
    position: relative;
    width: 100%;
    height: 40px;
  }

  input[type="range"] {
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    width: 100%;
    outline: none;
    position: absolute;
    margin: auto;
    top: 0;
    bottom: 0;
    background-color: transparent;
    pointer-events: none;
  }
  .slider-track {
    width: 100%;
    height: 5px;
    position: absolute;
    margin: auto;
    top: 0;
    bottom: 0;
    border-radius: 5px;
  }
  input[type="range"]::-webkit-slider-runnable-track {
    -webkit-appearance: none;
    height: 5px;
  }
  input[type="range"]::-moz-range-track {
    -moz-appearance: none;
    height: 5px;
  }
  input[type="range"]::-ms-track {
    appearance: none;
    height: 5px;
  }
  input[type="range"]::-webkit-slider-thumb {
    -webkit-appearance: none;
    height: 1.7em;
    width: 1.7em;
    background-color: #3264fe;
    cursor: pointer;
    margin-top: -9px;
    pointer-events: auto;
    border-radius: 50%;
  }
  input[type="range"]::-moz-range-thumb {
    height: 1.7em;
    width: 1.7em;
    cursor: pointer;
    border-radius: 50%;
    background-color: #3264fe;
    pointer-events: auto;
    border: none;
  }
  input[type="range"]::-ms-thumb {
    appearance: none;
    height: 1.7em;
    width: 1.7em;
    cursor: pointer;
    border-radius: 50%;
    background-color: #3264fe;
    pointer-events: auto;
  }
  input[type="range"]:active::-webkit-slider-thumb {
    background-color: #ffffff;
    border: 1px solid #3264fe;
  }

  .values {
    background-color: #3264fe;
    width: 80%;
    position: relative;
    margin: auto;
    margin-top: 4px;
    padding: 4px 0;
    border-radius: 5px;
    text-align: center;
    font-weight: 500;
    font-size: 20px;
    color: #ffffff;
    line-height: 1.5;
  }
</style>
