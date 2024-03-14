const validateSongNoList = (songNoList: number[]): void => {
  if (!(1 <= songNoList.length && songNoList.length <= 30)) {
    throw new Error('songNoList length must be between 1 and 30')
  }

  if (!(songNoList.map(x => 0 <= x && x <= 0xffff && Number.isInteger(x)).every(x => x))) {
    throw new Error('songNoList must be an array of integers between 0 and 0xffff')
  }

  // check duplication
  const set = new Set<number>()
  for (const no of songNoList) {
    if (set.has(no)) throw new Error('songNoList must not contain duplicate numbers')
    set.add(no)
  }
}

export const encodeBase64 = (songNoList: number[]): string => {
  validateSongNoList(songNoList)
  const byteArray = new Uint16Array(songNoList)
  const base64 = btoa(String.fromCharCode(...new Uint8Array(byteArray.buffer)))
  return base64
}

export const decodeBase64 = (base64: string): number[] => {
  const binaryString = atob(base64)
  const byteArray = new Uint8Array(binaryString.length)
  for (let i = 0; i < binaryString.length; i++) {
    byteArray[i] = binaryString.charCodeAt(i)
  }

  const ret = Array.from(new Uint16Array(byteArray.buffer))

  validateSongNoList(ret)
  return ret
}

export const sendRequest = async (songNoList: number[], tckt: string): Promise<void> => {
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
