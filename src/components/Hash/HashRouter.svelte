<script lang="ts">
    import Router from 'svelte-spa-router'
    import Training from '../Training/Training.svelte'
    import { writable } from 'svelte/store'
    import { setContext } from 'svelte'
    import HashHeader from './HashHeader.svelte'
    import TrainingAdd from '../Training/Add/TrainingAdd.svelte'

    const routes = {
      '/training': Training,
      '/training/add': TrainingAdd
    }

    const title = writable<string>('')
    setContext('title', title)
</script>

<HashHeader/>
<div class="container">
    <Router {routes}/>
</div>

<style>
    .container{
        display:flex;
        flex-direction: column;
        align-items: center;
    }
</style>
