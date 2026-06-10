import ClosetBtn from '../components/Closet/Closet-btn.svelte'

export default async function () {
    const target = document.querySelector('.favoriteArea.tmp');
    if (!target) return;
    const _ = new ClosetBtn({
        target: target
    });
}