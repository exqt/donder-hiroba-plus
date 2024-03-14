<script lang="ts">
  export let name: string
</script>

<button class="group-header" on:click>{name}</button>

<style>
  .group-header {
    background-color: #c72;
    font-size: 12px;
    padding: 2px;
    width: 100%;
    border: none;
    transition: all 0.1s ease-in-out;
    border-radius: 0px;
    box-shadow: none;
  }

  .group-header:hover {
    filter: brightness(0.8);
  }

  .group-header:active {
    filter: brightness(0.6);
  }
</style>
