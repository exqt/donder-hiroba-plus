<script lang="ts">
  import { onMount } from 'svelte'
  import Button from '../components/Common/Button.svelte'
  import { type ScoreStorage } from '../lib/scores'
  import { images } from '../assets'
  import { getDanImageURL, getDonderAvatarURL } from '../lib/donder'
  import type { BadgeType, CrownType, DonderInfo } from '../types'
  import type { SettingsStorage } from '../lib/settings'

  export let scoreStorage: ScoreStorage
  export let settingsStorage: SettingsStorage

  let donderInfo: DonderInfo = {}
  let byBadges: Record<BadgeType, number> = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0 }
  let byCrowns: Record<CrownType, number> = { none: 0, silver: 0, gold: 0, donderfull: 0 }
  let scorePanel = images.totalScorePanelOniImage

  onMount(async () => {
    donderInfo = settingsStorage.donderInfo
    const r = scoreStorage.countBadgesAndCrowns(['oni', 'oni_ura'])
    byBadges = r.badges
    byCrowns = r.crowns

    const diff = settingsStorage.preferringDifficulty ?? 'oni'
    scorePanel = {
      easy: images.totalScorePanelKantanImage,
      normal: images.totalScorePanelFutsuuImage,
      hard: images.totalScorePanelMuzukashiiImage,
      oni: images.totalScorePanelOniImage,
      oni_ura: images.totalScorePanelOniImage
    }[diff]
  })
</script>

<div class="wrapper">
  <div class="donder-info" style={`background-image: url(${images.titlePlate})`}>
    <div style="height: 20px;text-align: center;position:relative;z-index:1;font-weight: bold;text-shadow: 0 0 0px #000;">
      {donderInfo.title}
    </div>
    <div style="width:270px;height:23px;margin-left:10px;margin-right:10px;text-align:center;position:relative;z-index:1;display:flex;">
      <div style="width:135px;text-align:center;font-weight: bold;font-size: 12px;text-shadow: 0 0 0px #000;margin-top: 3px;">
        {donderInfo.name}
      </div>
      <div style="width:135px;text-align:center">
        <img src={getDanImageURL(donderInfo.id)} style="height:21px;margin:1px 0;" alt="danlabel">
      </div>
    </div>
  </div>

  <img class="avatar-image" src={getDonderAvatarURL(donderInfo.id)} alt="avatar" />

  <div class="total-score" style={`background-image: url(${scorePanel})`}>
    <span class="total-score-text" style="transform: translate(220px, 18px);">{byBadges[8]}</span>

    <span class="total-score-text" style="transform: translate(56px,  52px);">{byBadges[5]}</span>
    <span class="total-score-text" style="transform: translate(138px, 52px);">{byBadges[6]}</span>
    <span class="total-score-text" style="transform: translate(220px, 52px);">{byBadges[7]}</span>

    <span class="total-score-text" style="transform: translate(56px,  84px);">{byBadges[2]}</span>
    <span class="total-score-text" style="transform: translate(138px, 84px);">{byBadges[3]}</span>
    <span class="total-score-text" style="transform: translate(220px, 84px);">{byBadges[4]}</span>

    <span class="total-score-text crown" style="transform: translate(56px,  122px);"> {byCrowns.silver}</span>
    <span class="total-score-text crown" style="transform: translate(138px, 122px);"> {byCrowns.gold}</span>
    <span class="total-score-text crown" style="transform: translate(220px, 122px);"> {byCrowns.donderfull}</span>
  </div>

  <div class="hiroba-link-buttons">
    <a href="https://donderhiroba.jp/mypage_top.php" target="_blank">
      <Button>Home</Button>
    </a>
    <a href="https://donderhiroba.jp/history_mynews.php" target="_blank">
      <Button>History</Button>
    </a>
    <a href="https://donderhiroba.jp/score_list.php" target="_blank">
      <Button>Score</Button>
    </a>
    <a href="https://donderhiroba.jp/favorite_song_select.php?init=1" target="_blank">
      <Button>Favorite</Button>
    </a>
    <a href="https://donderhiroba.jp/mypage_other_setting.php" target="_blank">
      <Button>Settings</Button>
    </a>
  </div>
</div>

<style>
  .wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .donder-info {
    width: 290px;
    height: 46px;
    margin-top: 8px;
    background-size: contain;
    background-repeat: no-repeat;
    padding-top: 2px;
  }

  .avatar-image {
    width: 60%;
    height: auto;
    padding: 12px 0px;
  }

  .total-score {
    background-repeat: no-repeat;
    background-size: contain;
    height: 170px;
    width: 280px;
    text-align: left;
  }

  .total-score-text {
    position: absolute;
    font-weight: bold;
    color: white;
  }

  .total-score-text.crown {
    color: black;
  }

  .hiroba-link-buttons {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    width: 60%;
    justify-content: center;
  }
</style>
