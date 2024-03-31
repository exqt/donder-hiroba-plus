<script lang="ts">
  import { onMount } from 'svelte'
  import { type ExtensionStorage } from '../lib/storage'
  import type { DifficultyType, Language } from '../types'
  import { icons } from '../assets'
  import { parseScores } from '../lib/songs'
  import packageJson from '../../package.json'
  import type I18N from '../lib/i18n'

  export let storage: ExtensionStorage
  export let i18n: I18N

  const reset = async (): Promise<void> => {
    await storage.reset()
    window.close()
  }

  let language = ''

  const onLanguageChange = async (ev: Event): Promise<void> => {
    const language = (ev.target as HTMLSelectElement).value as Language
    storage.settings.language = language
    await storage.save()
    window.close()
  }

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
      console.log(tckt)

      // request update data
      updateMessage = 'Requesting update data... Don\'t close the popup.'
      const res = await fetch('https://donderhiroba.jp/ajax/update_score.php', {
        method: 'POST',
        headers: {
          'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
          'x-requested-with': 'XMLHttpRequest'
        },
        credentials: 'include',
        body: `_tckt=${tckt}`
      })
      const updateData = await res.text()
      console.log(updateData)
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
        console.log(doc)
        updateProgress++
      }

      docs.forEach((doc) => {
        const scores = parseScores(doc)
        console.log(scores)
        scores.forEach((score) => { storage.putScore(score) })
      })
      await storage.save()

      updateStatus = 'done'
      updateMessage = 'Updated song scores successfully.'
    } catch (e) {
      console.error(e)
      updateStatus = 'failed'
      updateMessage = 'Failed to update song scores. Please try again later.'
      disableUpdate = false
    }
  }

  let preferringDifficulty: DifficultyType
  const updatepreferringDifficulty = async (ev: Event): Promise<void> => {
    const preferringDifficulty = (ev.target as HTMLSelectElement).value as DifficultyType
    storage.settings.preferringDifficulty = preferringDifficulty
    await storage.save()
  }

  onMount(() => {
    language = storage.settings.language ?? 'en'
    preferringDifficulty = storage.settings.preferringDifficulty ?? 'oni'
  })

  const version = packageJson.version
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
  <div class="parse-score-wrapper">
    <button disabled={disableUpdate} on:click={updateSongScoreAll}>
      {i18n.t('Update Song Scores')}
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

  <!-- Reset -->
  <button class="warning" on:click={reset}>{i18n.t('Reset')}</button>

  <!-- GitHub Link -->
  <a class="github-link" href="https://github.com/exqt/donder-hiroba-plus" target="_blank">
    <img class="icon" src={icons.github} alt="github"/>
    <span>exqt/donder-hiroba-plus ({version}) </span>
  </a>
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

  .github-link {
    margin-top: auto;
    margin-bottom: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #000;
  }

  .github-link:hover {
    color: #0366d6;
  }

  .icon {
    width: 16px;
    height: 16px;
    margin-right: 4px;
  }
</style>
