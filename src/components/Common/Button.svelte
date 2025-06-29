<script lang="ts">
  export let active = false
  export let disabled = false
</script>

<button class:active on:click disabled={disabled}>
  <slot></slot>
</button>

<style>
  button {
    border-radius: 8px;
    border: 1px solid transparent;
    margin: 4px 2px;
    padding: 4px;
    font-size: 1em;
    font-weight: 500;
    font-family: inherit;
    background-color: #1a1a1a;
    color: white;
    cursor: pointer;
    transition: border-color 0.25s;
    box-shadow: none;
  }

  button:active {
    border-color: #646cff;
  }

  button:hover {
    border-color: #646cff;
  }

  button:focus,
  button:focus-visible {
    outline: 4px auto -webkit-focus-ring-color;
  }
</style>
