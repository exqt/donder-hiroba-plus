<script lang="ts">
  import { DIFFICULTIES } from '../../constants'
  import type { SongData } from '../../types'

  export let title: string
  export let songNo: string
  export let songData: SongData | undefined

  const urlTitle = title.replace(/ /g, '+')

  let bpmStr = '???'
  let lengthStr = '?:??'
  let noteCountStr = '???'
  let drumrollCountStr = '???'
  let balloonCountStr = '???'
  let artistComposerStr = '???'

  if (songData !== undefined) {
    if (songData.bpmMax !== undefined) bpmStr = songData.bpmMax.toString()
    if (songData.length !== undefined) {
      const t = Math.floor(songData.length)
      lengthStr = `${Math.floor(t / 60)}:${(t % 60).toString().padStart(2, '0')}`
    }
    if (songData.drumrollLengths !== undefined) {
      drumrollCountStr = DIFFICULTIES.map(diff => songData?.drumrollLengths[diff] ?? 0).join('/')
    }
    if (songData.balloonCounts !== undefined) {
      balloonCountStr = DIFFICULTIES.map(diff => songData?.balloonCounts[diff] ?? 0).join('/')
    }
    if (songData.artist !== undefined) {
      artistComposerStr = [songData.artist, songData.composer].filter(x => x !== undefined && x !== '').join(' / ')
    }
    if (songData.noteCounts !== undefined) {
      noteCountStr = DIFFICULTIES.map(diff => songData?.noteCounts[diff] ?? 0).join('/')
    }
  }
</script>

<div class="song-info">
  <div class="links">
    <a href={`https://www.youtube.com/results?search_query=%E5%A4%AA%E9%BC%93%E3%81%AE%E9%81%94%E4%BA%BA+${urlTitle}`} target="_blank">
      Youtube
    </a>
    <a href={`https://wikiwiki.jp/taiko-fumen/?cmd=search&word=${urlTitle}&type=AND`} target="_blank">
      wikiwiki.jp
    </a>
    <a href={`http://taiko.wiki/song/${songNo}/`} target="_blank">
      태고위키
    </a>
  </div>

  <div class="metadata">
    <span>♩ {bpmStr}</span>
    <span>⌛ {lengthStr}</span>
    <span>👨‍🎨 {artistComposerStr} </span>
    <span>🥁 {noteCountStr} </span>
    <span>🟡 {drumrollCountStr}</span>
    <span>🎈 {balloonCountStr}</span>
  </div>
</div>

<style>
  .song-info {
    margin-bottom: 12px;
  }

  .links {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
  }

  .links > a {
    height: 20px;
    background-color: #0004;
    border-radius: 4px;
    margin: 0 5px;
    color: white;
    border: none;
    text-decoration: none;
    font-size: 12px;
    padding: 2px;

    display: flex;
    justify-content: center;
    align-items: center;
  }

  .metadata {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
    word-break: keep-all;
  }

  .metadata > span {
    margin: 0 5px;
    text-align: center;
  }
</style>
