<script>
    import SS_ico from "../icons/system.svelte";
    import Str from "./star_mod.svelte";
    export let data = [];
    export let col = "#FFFFF";

    let expanded = true
    let bodies = data.bodies;
    if(bodies == undefined){
        bodies = "?";
    }
</script>
<div class="bar panel" aria-expanded={expanded} on:click={() => expanded = !expanded}>
    <svelte:component this={SS_ico} size="24px" col={col}/><div style="width:10px"/>
    <div class="bartext">{data.name}</div>
    <div class="barright"/>
    <div class="barrightfield">{bodies}</div>
</div>
<div class="bartray" hidden={!expanded}>
    {#if data.items != undefined}
        {#each data.items as item}
            <Str bind:data={item} col={col}/>
        {/each}
    {/if}
</div>
