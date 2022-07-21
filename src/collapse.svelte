<script>
    import E_ico from './icons/earth.svelte';
    import G_ico from './icons/giant.svelte';
    import M_ico from './icons/metal.svelte';
    import R_ico from './icons/rocky.svelte';
    import S_ico from './icons/star.svelte';
    import SS_ico from './icons/system.svelte';
    export let headerText;
    export let img;
    export let col = "#FFFFF";
    export let level = 0;
    
    let expanded = true
    if(level == 2){
      expanded = false; //options for planet border
    }
    let icons = {
      earth: E_ico,
      giant: G_ico,
      metal: M_ico,
      rocky: R_ico,
      star: S_ico,
      system: SS_ico,
    }
    //<button aria-expanded={expanded} on:click={() => expanded = !expanded} style="--col:{col}">{headerText}</button>
    export let indent = level*32;
</script>

<div class="collapsible">
        <div class="{level == 2 ? 'planet' : ''} bar panel" aria-expanded={expanded} on:click={() => expanded = !expanded} style="margin-left:{indent}px;">
          <svelte:component this={icons[img]} size="24px" col={col}/><div style="width:10px"/>{headerText}
        </div>
    <div class='contents' hidden={!expanded}>
        <slot></slot>
    </div>
</div>

<style>
  .collapsible {
    border-bottom: 0px solid var(--gray-light, #eee);
  }

  
	
  .bar[aria-expanded="true"]{
    outline: 1px;
  }

  .planet[aria-expanded="true"]{
    border-bottom: 0px;
    border-bottom-right-radius: 0;
    border-bottom-left-radius: 0;
  }
</style>