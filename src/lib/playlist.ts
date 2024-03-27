import { get, writable, type Writable } from 'svelte/store'
import type { FavoriteSong, GenreType, Playlist } from '../types'

const validateSongNoList = (songNoList: string[]): void => {
  if (!(1 <= songNoList.length && songNoList.length <= 30)) {
    throw new Error('songNoList length must be between 1 and 30')
  }

  const songNoListNum = songNoList.map(x => Number(x))

  if (!(songNoListNum.map(x => 0 <= x && x <= 0xffff && Number.isInteger(x)).every(x => x))) {
    throw new Error('songNoList must be an array of integers between 0 and 0xffff')
  }

  // check duplication
  const set = new Set<string>()
  for (const no of songNoList) {
    if (set.has(no)) throw new Error('songNoList must not contain duplicate numbers')
    set.add(no)
  }
}

export const encodeBase64 = (songNoList: string[]): string => {
  validateSongNoList(songNoList)
  const byteArray = new Uint16Array(songNoList.map(x => Number(x)))
  const base64 = btoa(String.fromCharCode(...new Uint8Array(byteArray.buffer)))
  return base64
}

export const decodeBase64 = (base64: string): string[] => {
  const binaryString = atob(base64)
  const byteArray = new Uint8Array(binaryString.length)
  for (let i = 0; i < binaryString.length; i++) {
    byteArray[i] = binaryString.charCodeAt(i)
  }

  const ret = Array.from(new Uint16Array(byteArray.buffer))

  const songNoListStr = ret.map(x => String(x))
  validateSongNoList(songNoListStr)
  return songNoListStr
}

export const updateFavoriteSongList = async (songNoList: string[], tckt: string): Promise<void> => {
  validateSongNoList(songNoList)

  const body = songNoList.map((no, i) => `song_no_${i}=${no}`).join('&') + `&_tckt=${tckt}`
  const res = await fetch('https://donderhiroba.jp/ajax/myfavorite_song.php', {
    headers: {
      accept: 'application/json, text/javascript, */*; q=0.01',
      'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
      'sec-fetch-dest': 'empty',
      'sec-fetch-mode': 'cors',
      'sec-fetch-site': 'same-origin',
      'x-requested-with': 'XMLHttpRequest'
    },
    referrer: 'https://donderhiroba.jp/favorite_song_select.php?init=1',
    referrerPolicy: 'strict-origin-when-cross-origin',
    body,
    method: 'POST',
    mode: 'cors',
    credentials: 'include'
  })

  console.log(res)
}

export const parseCurrentFavoriteSongList = (): FavoriteSong[] => {
  const songNames = document.querySelectorAll('.songName')
  const songNoList: FavoriteSong[] = []
  songNames.forEach((songName) => {
    const genre = /songNameFont(\w+)/.exec(songName.className)?.[1] as GenreType
    const songNo = songName.querySelector('input')?.value
    const title = songName.textContent?.trim()
    if (songNo !== undefined) {
      songNoList.push({
        genre: genre ?? 'unknown',
        songNo,
        title: title ?? 'unknown'
      })
    }
  })

  return songNoList
}

export class PlaylistsStore {
  private readonly store: Writable<Playlist[]>

  constructor (initialValue: Playlist[] = []) {
    this.store = writable(initialValue)
  }

  public async load (): Promise<void> {
    const storage = chrome?.storage?.local
    if (storage === undefined) {
      console.warn('storage is not available')
      return
    }

    const data = await storage.get('playlists') as { playlists: Playlist[] }
    this.store.set(data.playlists)
  }

  public subscribe (run: (value: Playlist[]) => void): () => void {
    return this.store.subscribe(run)
  }

  public async add (playlist: Playlist): Promise<void> {
    const playlists = get(this.store)
    if (playlists.some(x => x.uuid === playlist.uuid)) {
      alert('Playlist with the same uuid already exists')
    }

    await this.set([...playlists, playlist])
  }

  public async remove (playlist: Playlist): Promise<void> {
    const newPlaylists = get(this.store).filter(x => x.uuid !== playlist.uuid)
    await this.set(newPlaylists)
  }

  public async set (playlists: Playlist[]): Promise<void> {
    const storage = chrome?.storage?.local
    if (storage === undefined) {
      console.warn('storage is not available')
      return
    }

    await storage.set({ playlists })
    this.store.set(playlists)

    console.log('Saved playlists', playlists)
  }

  public get (): Playlist[] {
    return get(this.store)
  }
}
