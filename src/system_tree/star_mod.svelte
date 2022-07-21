<script>
    import S_ico from "../icons/star.svelte";
    import F_ico from "../icons/fuel.svelte";
    import Plnt from "./planet_mod.svelte";
    export let data;
    export let col = "#FFFFF";
    let expanded = true

    function expand(){
        expanded = !expanded;
    }
</script>


{#if data.items.length > 0}
<div class="bar panel" aria-expanded={expanded} on:click={expand}>
    <svelte:component this={S_ico} size="24px" col={col}/><div />
    {data.name}
    <div class="barright"></div>
        {data.startype}{data.starsubtype}<div style="width:2px"/>
        {#if data.fuel}<svelte:component this={F_ico} size="13px" col={col}/>{/if}
        <div style="width:17px"/>
        <div class="barrightfield mono">Mass {data.mass.toFixed(3)}</div>
</div>
<div class="bartray" hidden={!expanded}>
    {#each data.items as item}
        <Plnt bind:data={item} col={col}/>
    {/each}
</div>
{:else}
<div class="bar panel" aria-expanded={false}>
    <svelte:component this={S_ico} size="24px" col={col}/><div style="width:10px"/>
    {data.name}
</div>
{/if}
