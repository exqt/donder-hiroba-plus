<script lang="ts">
  const close = (): void => {
    window.close()
  }
</script>

<div class="wrapper">
  <p>
    You are not logged in. Please log-in on
    <a href="https://donderhiroba.jp/index.php" target="_blank" on:click={close}>Donder Hiroba</a>
    and try again.
  </p>
</div>

<style>
  .wrapper {
    background-color: #000a;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 24px;
    z-index: 10;
    color: white;
  }

  a {
    color: #2d8fff;
    text-decoration: underline;
  }
</style>
