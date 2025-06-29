<script lang="ts">
  export let uploadMessage: string
</script>

<div class="upload-progress">
  {uploadMessage}
</div>

<style>
  .upload-progress {
    text-align: center;
    font-size: 1rem;
    padding: 20px;
  }
</style>
