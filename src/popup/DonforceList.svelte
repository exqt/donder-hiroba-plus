<script lang="ts">
  import { onMount } from 'svelte'
  import RatingItem from '../components/Popup/RatingItem.svelte'
  import { DIFFICULTY_COLORS, DIFFICULTY_TO_INDEX } from '../constants'
  import { type SongDB } from '../lib/songDB'
  import { getSongDetailLink } from '../lib/songs'

  interface UserRatingData {
    currentRating: number
    currentExp: number | null
    ratingDataWithScoreData: Array<{
      songNo: number
      difficulty: 'oni' | 'ura'
      songRating: {
        value: number
        accuracy: number
        measureValue: number
      }
      scoreData: {
        crown: 'played' | 'silver' | 'gold' | 'donderfull'
        badge: 'rainbow' | 'purple' | 'pink' | 'gold' | 'silver' | 'bronze' | 'white' | null
        score: number
        ranking: number
        good: number
        ok: number
        bad: number
        maxCombo: number
        roll: number
        count: {
          play: number
          clear: number
          fullcombo: number
          donderfullcombo: number
        }
      } | null
    }>
  }

  let userRatingData: UserRatingData
  let status = 'loading'
  let message = ''

  const getData = async (): Promise<void> => {
    try {
      const url = 'https://taiko.wiki/api/user/rating'
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      })

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Unauthorized access - 401')
        } else {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
      }

      const data = await response.json()
      userRatingData = data
      status = 'success'
    } catch (e) {
      console.error(e)
      status = 'failed'
      message = e instanceof Error ? e.message : 'Unknown error'
    }
  }

  onMount(async () => {
    await getData()
  })

  export let songDB: SongDB
</script>

<div class="wrapper">
  {#if status === 'loading'}
    <span>Loading...</span>
  {:else if status === 'failed'}
    <span>Failed to get data</span>
    <span>{message}</span>
  {/if}

  <div class="top">
    <a href="https://taiko.wiki/rating/me" target="_blank">
      <span class="top-text">taiko.wiki rating</span>
    </a>
  </div>

  {#if userRatingData}
    <div class="current-rating">
      <span>Current Rating: {userRatingData?.currentRating}</span>
      <span>Current Exp: {userRatingData?.currentExp}</span>
    </div>
  {/if}

  {#if userRatingData?.ratingDataWithScoreData}
  <div class="score-container">
    {#each userRatingData.ratingDataWithScoreData as item, i (item.songNo + item.difficulty)}
      {@const diff = item.difficulty === 'ura' ? 'oni_ura' : 'oni'}
      {@const color = DIFFICULTY_COLORS[DIFFICULTY_TO_INDEX[diff]]}
      {@const link = getSongDetailLink(item.songNo.toString(), diff)}
      {@const songData = songDB.getSongData(item.songNo.toString())}
      {@const title = songData?.title ?? ''}
      {#if item !== null}
        <RatingItem
          {item}
          {i}
          {link}
          {color}
          {title}
        />
      {/if}
    {/each}

    <!--
    {#each items as item, i (item.songNo + item.difficulty)}
      {@const color = DIFFICULTY_COLORS[DIFFICULTY_TO_INDEX[item.difficulty]]}
      {@const songData = songDB.getSongData(item.songNo)}
      {@const detail = scoreStorage.getScoreByNo(item.songNo)?.details[item.difficulty]}
      {@const link = getSongDetailLink(item.songNo, item.difficulty)}
      {@const level = analyzer.getLevelWidthSub(item.songNo, item.difficulty)}
      <DonforceItemComponent {item} {i} {songData} {detail} {link} {color} {level} />
    {/each}
    {#if items.length !== scores.length}
      <button on:click={loadAll}>Load All</button>
    {/if}
    -->
  </div>
  {/if}
</div>

<style>
  .wrapper {
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  .top {
    margin: 12px 0px;
  }

  .top-text {
    font-size: 20px;
  }

  .score-container {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    overflow: auto; /* Add this if you want .score-container to be scrollable when its content overflows */
  }

  .current-rating {
    display: flex;
    flex-direction: column;
  }

  .current-rating span {
    margin: 4px 12px;
    padding: 4px;
    color: aliceblue;
    background-color: #0004;
    border-radius: 4px;
    margin-right: 12px;
  }
</style>
