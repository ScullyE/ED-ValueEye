<script>
    import { onDestroy } from 'svelte';
    export let text;
    export let speed = 20;
    let bars = "";
    let count = 0;

    function addbars(){
        bars = bars+"/";
        count++;
        if (count > 38){
            count = 0;
            bars = "";
        }
    }

    let clear;
    $: {
	    clearInterval(clear);
	    clear = setInterval(addbars, speed);
    }

    onDestroy(() => {
		clearInterval(clear);
	});

</script>
<div class="warning panel">
    <div>{bars}</div>
    <div class="warningtext">{text}</div>
    <div>{bars}</div>
</div>
