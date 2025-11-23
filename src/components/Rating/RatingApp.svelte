<script lang="ts">
    import hiroba from 'node-hiroba'
    import Profile from './RatingProfile.svelte'
    import UploadControls from './UploadControls.svelte'
    import ScoreDataTable from './ScoreDataTable.svelte'
    import UploadProgress from './UploadProgress.svelte'
    import type { CardData } from 'node-hiroba/types'
    import RecentScoreStorage from './recentScoreStorage'
    import { onMount } from 'svelte'
    import { UploadService } from './services/UploadService'
    import { updateScoreDataSorted, type SortedScoreData } from './services/ScoreDataService'
    import { DonderHiroba, type Summary } from 'hiroba-js'

    let scene: 'ready' | 'upload' = 'ready'
    let message: string = ''
    let uploadMessage: string = ''
    let notlogined = false

    let storage: RecentScoreStorage
    let storageLoaded = false
    let lastUpdated: string | null = null
    let scoreDataSorted: SortedScoreData[] = []
    let cardData: CardData & { summary?: Summary } | null = null
    let sendType: 'clear' | 'score' | 'all' | 'recent' = 'all'

    const uploadService = new UploadService()

    onMount(async () => {
      try {
        cardData = await DonderHiroba.func.getCurrentLogin().catch(() => null)
      } catch (err) {
        console.warn(err)
        notlogined = true
        message = 'Failed to get card data'
        return
      }

      cardData = await hiroba.getCurrentLogin(null)
      storage = new RecentScoreStorage(cardData.taikoNumber.toString())
      await storage.loadFromChromeStorage()

      storageLoaded = true
      lastUpdated = storage.getLastUpdated()
      updateScoreData()
    })

    const updateScoreData = (): void => {
      const result = updateScoreDataSorted(storage)
      scoreDataSorted = result.scoreDataSorted
    }

    async function handleUpload (): Promise<void> {
      if (!confirm('Send your donderhiroba datas to https://rating.taiko.wiki. It will be deleted together when you delete your account. Do you agree?')) {
        alert('Canceled.')
        message = ''
        uploadMessage = ''
        scene = 'ready'
        return
      }

      if (!await uploadService.checkWikiLogin()) {
        message = 'Wiki Not Logined'
        console.warn('Wiki Not Logined\n Please login to https://taiko.wiki/auth/login and reload the page.')
        // open url
        const url = 'https://taiko.wiki/auth/login'
        window.open(url, '_blank')
        return
      }

      try {
        scene = 'upload'
        uploadMessage = ''

        const onProgress = (msg: string): void => {
          uploadMessage = msg
        }

        if (sendType === 'clear') {
          await uploadService.sendClearData(storage, cardData, onProgress)
        } else if (sendType === 'all') {
          await uploadService.sendAllData(storage, cardData, onProgress)
        }

        updateScoreData()
        message = 'Upload completed'
        scene = 'ready'
      } catch (err) {
        console.warn(err)
        message = 'Upload Error'
        scene = 'ready'
      }
    }

    async function handleClearCache (): Promise<void> {
      await storage.clear()
      location.reload()
    }
</script>

<div class="container">
    {#if notlogined}
        <div class="error_display">Not Logined</div>
    {:else if cardData === null}
        Loading...
    {:else}
        {#if scene === 'ready'}
            {#if message}
                <div class="error_display">{message}</div>
            {/if}
            <Profile {cardData} />

            <UploadControls
              bind:sendType={sendType}
              onUpload={handleUpload}
              disabled={scene !== 'ready'}
            />

            {#if storageLoaded}
              <ScoreDataTable
                {scoreDataSorted}
                {lastUpdated}
                onClearCache={handleClearCache}
              />
            {/if}
        {:else if scene === 'upload'}
            <UploadProgress {uploadMessage} />
        {/if}
    {/if}
</div>

<style>
    .container {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        font-size: 1rem;
        text-align: center;
        line-height: 1.5;
    }

    .error_display {
        color: red;
        font-weight: bold;
    }
</style>
