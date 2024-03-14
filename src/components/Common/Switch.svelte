<script lang="ts">
  export let checked = false
  export let label = ''
</script>

<div class="wrapper">
  <label class="switch">
    <input type="checkbox" bind:checked={checked}>
    <span class="slider round"></span>
  </label>
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <span class="switchlabel" on:click={() => { checked = !checked }}> {label} </span>
</div>

<style>
  .wrapper {
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  .switch {
    position: relative;
    display: inline-block;
    width: 28px;
    height: 16px;
    margin-right: 8px;
  }

  .switch input {
    opacity: 0;
    width: 0;
    height: 0;
  }

  .slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #ccc;
    transition: .1s;
  }

  .slider:before {
    position: absolute;
    content: "";
    height: 12px;
    width: 12px;
    left: 2px;
    bottom: 2px;
    background-color: white;
    transition: .1s;
  }

  input:checked + .slider {
    background-color: #2196F3;
  }

  input:focus + .slider {
    box-shadow: 0 0 1px #2196F3;
  }

  input:checked + .slider:before {
    transform: translateX(12px);
  }

  .slider.round {
    border-radius: 15px;
  }

  .slider.round:before {
    border-radius: 50%;
  }

  .switchlabel {
    font-size: 16px;
  }
</style>
