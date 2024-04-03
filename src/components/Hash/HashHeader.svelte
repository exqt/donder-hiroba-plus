<script>
    import { getContext } from 'svelte'

    const title = getContext('title')
</script>

<header style="background-image:url(image/sp/640/menu_03_640.png);color:#ffffff;">
    <h1>{$title}</h1>
    <ul class="left">
        <li class="boxLink"><a id="headerHref" href="https://donderhiroba.jp/index.php">
        <img src="image/sp/640/menu_01_640.png" alt=""></a></li>
    </ul>
    <ul class="right">
        <li id="renew" class="imageArea"><a id="ScoreUpdate">
        <img src="image/sp/640/menu_02_640.png" width="30" height="30" style="cursor:pointer;" alt=""></a></li>
    </ul>
</header>
