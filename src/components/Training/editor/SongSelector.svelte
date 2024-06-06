<script lang="ts">
  import { type SongDB } from '../../../lib/songDB'
    import type { GenreType } from '../../../types'

  export let selecting: boolean
  export let songNo: number
  export let gradient: (
    genres: GenreType[],
  ) => string

  export let songDB: SongDB
</script>

{#if selecting}
  <div class="modal">
    <div class="close-container">
      <button
        class="close"
        on:click={() => {
          selecting = false
        }}>X</button
      >
    </div>
    <div class="songs">
      {#each songDB.getAll() as song}
        <button
          on:click={() => {
            selecting = false
            songNo = parseInt(song[0])
          }}
          style={`background:${gradient(song[1].genre)};`}
        >
          {song[1].title}
        </button>
      {/each}
    </div>
  </div>
{/if}

<style>
  .modal {
    width: 300px;
    height: calc(100vh - 60px);

    position: fixed;
    z-index: 1;

    left: 50%;
    top: 50%;

    transform: translate(-50%, -50%);

    overflow-x: hidden;
    overflow-y: hidden;

    display: flex;
    flex-direction: column;
    align-items: center;

    background-color: #ff7f00;
    border-radius: 5px;
    border: 2px solid white;

    box-sizing: border-box;
  }

  .close-container {
    width: 100%;
    height: 16px;
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
  }

  .close {
    width: 30px;
    height: 16px;

    display: flex;
    justify-content: center;
    align-items: center;

    color: black;
    font-weight: normal;
    text-shadow: none;
  }

  .songs {
    width: 100%;
    height: calc(100% - 16px);

    overflow-x: hidden;
    overflow-y: scroll;

    display: flex;
    flex-direction: column;
    align-items: center;
  }

  button {
    border: 2px solid rgba(255, 255, 255, 0.5);
    width: 265px;
    height: 42px;

    margin-bottom: 4px;
    color: white;
    font-weight: bold;
    text-shadow:
      -2px -2px 2px rgba(142, 142, 142, 0.606),
      2px -2px 2px rgba(142, 142, 142, 0.606),
      -2px 2px 2px rgba(142, 142, 142, 0.606),
      2px 2px 2px rgba(142, 142, 142, 0.606);
  }
</style>
