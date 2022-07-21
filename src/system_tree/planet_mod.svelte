<script>
    import E_ico from '../icons/earth.svelte';
    import G_ico from '../icons/giant.svelte';
    import M_ico from '../icons/metal.svelte';
    import R_ico from '../icons/rocky.svelte';

    import Map_ico from '../icons/unmapped.svelte';
    import Terr_ico from '../icons/terraform.svelte';
    import Land_ico from '../icons/land.svelte';
    import Undis_ico from '../icons/undiscovered.svelte'

    export let data;
    export let col = "#FFFFF";

    let expanded = false
    
    let icons = {
      earth: E_ico,
      giant: G_ico,
      metal: M_ico,
      rocky: R_ico,
    }

    let icon;
    if(data.planet_type == "rocky"){
        icon = icons.rocky;
    } else if (data.planet_type == "metal"){
        icon = icons.metal;
    } else if (data.planet_type == "giant"){
        icon = icons.giant;
    } else {
        icon = icons.earth;
    }

    let highvalue = false;
    if(!data.mapped && icon == icons.earth){//change to based on calaculated value +400k (future update to based on user input value)
        let highvalue = true;
    }

    function cap(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
</script>
<div class="bar panel" aria-expanded={expanded} on:click={() => expanded = !expanded}>
    <svelte:component this={icon} size="24px" col={col}/><div style="width:10px"/>
    {data.name}
    <div class="barright"></div>
        <div class="iconbox">{#if data.canland}<svelte:component this={Land_ico} size="20px" col={col}/>{/if}<div style="width:8px"/></div>
        <div class="iconbox">{#if data.terraform}<svelte:component this={Terr_ico} size="20px" col={col}/>{/if}<div style="width:8px"/></div>
        <div class="iconbox">{#if !data.mapped}<svelte:component this={Map_ico} size="20px" col={col}/>{/if}<div style="width:8px"/></div>
        <div class="iconbox">{#if !data.discovered}<svelte:component this={Undis_ico} size="20px" col={col}/>{/if}<div class="barspace"/></div>
    <div class="barrightfield mono">{data.value.toLocaleString()} CR</div>
        
</div>

<div class="infobox bartray panel" hidden={!expanded}>
    <div class="infodetailscontainer">
        <div class="infodetails infoleft">
            <strong>{data.fullclass}</strong><br/>
            Mass: {data.mass}<br/>
            Gravity: {data.gravity}<br/>
            Temp: {data.temp}<br/>
            Pressure: {data.pressure}<br/>
        </div>
        <div class="infodiv"></div>
        <div class="infodetails inforight">
            {#if data.mats != undefined}
            <div class="infonums">
                <strong>Materials</strong><br/>
                
                {#each data.mats as mat}
                    {cap(mat.Name)} ({mat.Percent.toFixed(3)}%)<br/>
                {/each}

            </div>
            <div class="infochart">
                <br/>
                {#each data.mats as mat}
                    <div class="infochartbar" style="width:{mat.Percent}%;"><br/></div>
                {/each}
            </div>
            {/if}
            
        </div>
    </div>
</div>
