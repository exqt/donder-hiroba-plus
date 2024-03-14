import Favorite from '../components/Favorite.svelte'

export default async (): Promise<void> => {
  console.log('fav')
  const favoriteSong = document.querySelector('.favoriteSong')
  if (favoriteSong === null) {
    return
  }

  const div = document.createElement('div')
  favoriteSong.insertBefore(div, favoriteSong.firstChild)

  const tcktElem = document.querySelector('#_tckt')
  console.log(tcktElem)
  if (tcktElem === null) {
    return
  }

  const tckt = tcktElem.attributes.getNamedItem('value')?.value
  console.log(tckt)

  // const favorite = new Favorite({
  //   target: div,
  //   props: {
  //     tckt
  //   }
  // })
}
