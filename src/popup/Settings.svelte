<script lang="ts">
  import { onMount } from 'svelte'
  import type { DifficultyType, Language } from '../types'
  import { icons } from '../assets'
  import packageJson from '../../package.json'
  import type I18N from '../lib/i18n'
  import type { SettingsStorage } from '../lib/settings'
  import type { ScoreStorage } from '../lib/scores'
  import { SongDB } from '../lib/songDB'

  export let settingsStorage: SettingsStorage
  export let scoreStorage: ScoreStorage
  export let songDB: SongDB
  export let i18n: I18N

  const reset = async (): Promise<void> => {
    await settingsStorage.reset()
    await scoreStorage.reset()
    await songDB.reset()
    window.close()
  }

  const onLanguageChange = async (ev: Event): Promise<void> => {
    const language = (ev.target as HTMLSelectElement).value as Language
    settingsStorage.language = language
    await settingsStorage.save()
    window.close()
  }

  /*
  let updateStatus = ''
  let updateMessage = ''
  let updateProgress = 0
  let disableUpdate = false
  const updateSongScoreAll = async (): Promise<void> => {
    updateStatus = 'updating'
    disableUpdate = true

    try {
      // get tckt
      const mypage = await fetch('https://donderhiroba.jp/mypage_top.php')
      const mypageDoc = new DOMParser().parseFromString(await mypage.text(), 'text/html')
      const tckt = mypageDoc.getElementById('content')?.querySelector('#_tckt')?.textContent
      if (tckt === undefined || tckt === null) {
        updateStatus = 'failed'
        updateMessage = 'Failed to get tckt. you might not logged in.'
        disableUpdate = false
        return
      }
      updateProgress++

      // request update data
      updateMessage = 'Requesting update data... Don\'t close the popup.'
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const res = await fetch('https://donderhiroba.jp/ajax/update_score.php', {
        method: 'POST',
        headers: {
          'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
          'x-requested-with': 'XMLHttpRequest'
        },
        credentials: 'include',
        body: `_tckt=${tckt}`
      })
      // const updateData = await res.text()
      // TODO: check message
      updateProgress++

      // visit every genre page
      const docs = []
      for (let i = 1; i <= 8; i++) {
        const url = `https://donderhiroba.jp/score_list.php?genre=${i}`
        updateMessage = `Visiting Score Page: ${i}/8`
        const response = await fetch(url)
        const text = await response.text()
        const doc = new DOMParser().parseFromString(text, 'text/html')
        docs.push(doc)
        updateProgress++
      }

      docs.forEach((doc) => {
        const scores = parseScores(doc)
        scores.forEach((score) => { scoreStorage.putScore(score) })
      })
      await scoreStorage.save()

      updateStatus = 'done'
      updateMessage = 'Updated song scores successfully.'
    } catch (e) {
      console.error(e)
      updateStatus = 'failed'
      updateMessage = 'Failed to update song scores. Please try again later.'
      disableUpdate = false
    }
  }
  */

  let preferringDifficulty: DifficultyType
  const updatepreferringDifficulty = async (ev: Event): Promise<void> => {
    const preferringDifficulty = (ev.target as HTMLSelectElement).value as DifficultyType
    settingsStorage.preferringDifficulty = preferringDifficulty
    await settingsStorage.save()
  }

  let disableSongDataUpdate = false
  const forceSongDataUpdate = async (): Promise<void> => {
    try {
      const songDB = await SongDB.getInstance()
      await songDB.fetchAndStoreSongData(true)
    } catch (e) {
      console.error(e)
    }

    disableSongDataUpdate = true
  }

  let language: Language

  onMount(() => {
    language = settingsStorage.language ?? 'en'
    preferringDifficulty = settingsStorage.preferringDifficulty ?? 'oni'
  })

  const version = packageJson.version

  const ratingTabLink = `chrome-extension://${chrome?.runtime?.id}/rating.html`
</script>

<div class="wrapper">
  <h1>{i18n.t('Settings')}</h1>

  <!-- Language Selection -->
  <div>
    <label for="language">{i18n.t('Language')}</label>
    <select id="language" bind:value={language} on:change={onLanguageChange}>
      <option value="en">English</option>
      <option value="ja">日本語</option>
      <option value="ko">한국어</option>
    </select>
  </div>

  <!-- preferring Difficulty -->
  <div>
    <label for="preferring-difficulty">{i18n.t('Preferring Difficulty')} </label>
    <select id="preferring-difficulty" bind:value={preferringDifficulty} on:change={updatepreferringDifficulty}>
      <option value="easy">{i18n.t('Kantan')}</option>
      <option value="normal">{i18n.t('Futsuu')}</option>
      <option value="hard">{i18n.t('Muzukashii')}</option>
      <option value="oni">{i18n.t('Oni')}</option>
    </select>
  </div>

  <!-- Parse Score -->
  <!--
  <div class="parse-score-wrapper">
    <button disabled={disableUpdate} on:click={updateSongScoreAll}>
      Update Donforce
    </button>
    {#if updateStatus === 'updating'}
      <p>Updating...</p>
      <progress value={updateProgress} max="10"></progress>
    {:else if updateStatus === 'done'}
      <p>{updateMessage}</p>
    {:else if updateStatus === 'failed'}
      <p>{updateMessage}</p>
    {/if}
  </div>
  -->

  <a href={ratingTabLink} target="_blank">
    <button>
      taiko.wiki Rating Upload
      <br>
      <span style="font-size: 0.8rem;">서열표 색칠, 레이팅 업로드</span>
    </button>
  </a>

  <!-- Reset -->
  <button class="warning" on:click={reset}>{i18n.t('Reset')}</button>

  <!-- ForceSongDataUpdate -->
  <button class="warning" disabled={disableSongDataUpdate} on:click={forceSongDataUpdate}>{'Force SongData Update'}</button>
  <span></span>

  <a href="https://docs.google.com/forms/d/1Vip2obD-XN8ie6qHEcwBETMFChbh6PxSqxy0O2FqmWc/edit" target="_blank">
    <button class="info">
      Help Deskop
    </button>
  </a>

  <div class="footer">
    <a href="https://github.com/exqt/donder-hiroba-plus" target="_blank">
      <img class="icon" src={icons.github} alt="github"/>
      <span>exqt/donder-hiroba-plus ({version}) </span>
    </a>

    <span>
      SongData by
      <a style="display: inline;" href="https://taiko.wiki" target="_blank">
        Taiko.Wiki
      </a>
    </span>
  </div>
</div>

<style>
  h1 {
    font-size: 24px;
  }

  .wrapper {
    margin: 0;
    height: 100%;
    display: flex;
    flex-direction: column;
    padding: 0px 10px;
    gap: 12px;
  }

  button {
    width: 100%;
    padding: 8px 16px;
    font-size: 16px;
    border-radius: 4px;
    color: white;
    border: none;
    cursor: pointer;
    background-color: #0366d6;
    margin: 8px 0px;
  }

  button.warning {
    background-color: #d73a49;
  }

  button:disabled {
    background-color: #575757;
    cursor: not-allowed;
  }

  button.info {
    background-color: #28a745;
  }

  .footer {
    margin-top: auto;
    margin-bottom: 12px;
  }

  a {
    display: flex;
    align-items: center;
    justify-content: center;
    color: #000;
  }

  a:hover {
    color: #0366d6;
  }

  .icon {
    width: 16px;
    height: 16px;
    margin-right: 4px;
  }
</style>
