<script lang="ts">
  export let active = false
</script>

<button class:active on:click>
  <slot></slot>
</button>

<style>
  button {
    border-radius: 8px;
    border: 1px solid transparent;
    padding: 0.6em 1.2em;
    margin: 0.2em;
    font-size: 1em;
    font-weight: 500;
    font-family: inherit;
    background-color: #1a1a1a;
    color: white;
    cursor: pointer;
    transition: border-color 0.25s;
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
