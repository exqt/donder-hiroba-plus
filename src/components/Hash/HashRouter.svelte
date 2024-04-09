<script lang="ts">
    import Router from 'svelte-spa-router'
    import Training from '../Training/pages/Training.svelte'
    import { writable } from 'svelte/store'
    import { setContext } from 'svelte'
    import TrainingAdd from '../Training/pages/add/TrainingAdd.svelte'

    const routes = {
      '/training': Training,
      '/training/add': TrainingAdd
    }

    const title = writable<string>('')
    setContext('title', title)
</script>

<header style="background-image:url(image/sp/640/menu_03_640.png);color:#ffffff;">
    <h1>{$title}</h1>
    <ul class="left">
        <li class="boxLink"><a id="headerHref" href="https://donderhiroba.jp/index.php">
        <img alt="" src="image/sp/640/menu_01_640.png"></a></li>
    </ul>
    <ul class="right">
        <li id="renew" class="imageArea"><a id="ScoreUpdate">
        <img alt="" src="image/sp/640/menu_02_640.png" width="30" height="30" style="cursor:pointer;"></a></li>
    </ul>
</header>

<div class="container">
    <Router {routes}/>
</div>

<style>
    .container {
        display:flex;
        flex-direction: column;
        align-items: center;
    }
</style>
