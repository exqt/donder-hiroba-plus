<script lang="ts">
  export let sendType: 'clear' | 'score' | 'all' | 'recent' = 'all'
  export let onUpload: () => Promise<void>
  export let disabled: boolean = false
</script>

<div class="upload-controls">
  <label>
    <input type="radio" bind:group={sendType} value="clear" disabled={disabled} />
    only clear data (서열표 색칠만)
  </label>
  <!--
  <label>
    <input type="radio" bind:group={sendType} value="score" />
    clear data + score data (old method, slow)
  </label>
  -->
  <label>
    <input type="radio" bind:group={sendType} value="all" disabled={disabled} />
    clear data + score data (레이팅)
  </label>

  <button
    style="margin-top: 20px; font-size: 1.5rem;"
    on:click={onUpload}
    disabled={disabled}
  >
    Upload
  </button>
</div>

<style>
  .upload-controls {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
  }

  label {
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
  }

  button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
</style>
