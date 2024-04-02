import { type PlaydataType, type SongData } from "../types";
import BestScore from "../components/Dani/BestScore.svelte";

export default async function dani(): Promise<void> {
    if ((new URL(window.location.href)).pathname !== "/dan_detail.php") return;

    const boxes = [...document.querySelectorAll('.contentBox:not(.errorArea)')];
    const songdata = (await import('../songdata.json') as any).default as Record<string, SongData>

    boxes.map((box) => {
        const bestscore = new BestScore({
            target: box,
            props: {
                playdata: (async () => {
                    const songTitle = (box.querySelector('.songName') as HTMLElement).innerText.trim();
                    console.log(songTitle);
                    const songNo = (Object.values(songdata).find(song => song.title === songTitle) as any)?.songNo;
                    const difficulty = box.querySelector('img')?.src.replace(/https:\/\/donderhiroba.jp\/image\/sp\/640\/level_icon_(.)_640.png/, "$1")

                    //db에 해당 곡명을 가진 곡에 대한 데이터가 없으면 종료
                    if (songNo === undefined || difficulty === undefined) throw new Error();

                    let response: string;
                    try {
                        response = await (await fetch(`/score_detail.php?song_no=${songNo}&level=${difficulty}`)).text()
                    }
                    catch {
                        //요청에 문제가 생기면 종료
                        throw new Error();
                    }

                    const dom = document.createElement('div');
                    dom.innerHTML = response;
                    const scoreDetailTable = dom.querySelector('.scoreDetailTable');

                    //scoreDetailTable이 없으면 종료
                    if (scoreDetailTable === null) throw new Error();
                    /*
                    한번도 플레이한 적이 없으면 종료
                    그냥 0점으로 표시할거면 밑줄 지우세요
                    */
                    if (dom.querySelector('.contentBox.errorArea')) throw new Error();

                    const playdata:PlaydataType = {
                        score: parseInt((dom.querySelector('.high_score') as HTMLElement).innerText.trim().replace('点', '')),
                        good: parseInt((dom.querySelector('.good_cnt') as HTMLElement).innerText.trim().replace('回', '')),
                        ok: parseInt((dom.querySelector('.ok_cnt') as HTMLElement).innerText.trim().replace('回', '')),
                        ng: parseInt((dom.querySelector('.ng_cnt') as HTMLElement).innerText.trim().replace('回', '')),
                        pound: parseInt((dom.querySelector('.pound_cnt') as HTMLElement).innerText.trim().replace('回', '')),
                        combo: parseInt((dom.querySelector('.combo_cnt') as HTMLElement).innerText.trim().replace('回', '')),
                        hit: 0
                    }

                    playdata.hit = playdata.good + playdata.ok + playdata.pound;

                    return playdata;
                })()
            }
        })
    })

    return;
}