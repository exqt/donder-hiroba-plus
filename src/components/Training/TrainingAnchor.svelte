<script lang="ts">
    function gotoTraining (): void {
      const url = new URL(window.location.origin)
      url.hash = '#/training'
      window.location.href = url.href
    }
</script>

<div class="anchor" role="presentation" on:click={gotoTraining}>
    훈련
</div>

<style>
    .anchor{
        width:300px;
        height:50px;

        cursor: pointer;

        color:white;

        display:flex;
        justify-content: center;
        align-items: center;

        background-image: url('image/sp/640/btn_r_02_640.png');
        background-size: 100% 100%;
    }
</style>
