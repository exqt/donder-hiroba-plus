<script lang="ts">
    function openPopup (): void {
      const url = new URL(location.href)
      url.pathname = '/'
      url.hash = '/closet'
      Array.from(url.searchParams).forEach(([k, _]) => {
        console.log(k)
        url.searchParams.delete(k)
      })

      location.href = url.href
    }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->

<div
    class="button"
    on:click={openPopup}
>
    <div class="text">
        Closet++
    </div>
</div>

<style>
    .button{
        display:flex;
        justify-content: center;
        align-items: center;
    }

    .text{
        background-image: url('image/sp/640/btn_p_04_640.png');
        background-size: 100% 100%;
        width: 100px;
        height: 40px;
        display:flex;
        justify-content: center;
        align-items: center;
    }
</style>
