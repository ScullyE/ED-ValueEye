<script>

	import Sys from './system_tree/system_mod.svelte'
	import Warn from './misc/warning_box.svelte'
	import file_ico from './icons/file.svelte'
	import { readable, writable, derived } from 'svelte/store'

	export let path;
	path = "";
	let filecheck = false;
	let sys_data = writable({});
	let status = "";
	
	let bgpath = "";
	let linecolor = '';
	$: cssvars = `--line-color:${linecolor};--bg-path:${bgpath}`;

	const sendmsg = (message) => {
		window.api.debugmsg(message);
	}

	const getfile = () => {
		window.api.openfiledialog("file");
	}

	const setbg = () => {
		window.api.openfiledialog("bg");
	}

	const refresh = () => {
		window.api.refresh(1);
	}

	const savecolor = () => {
		window.api.savecolor(linecolor);
		console.log("color save: "+linecolor);
	}

	window.api.filecheck((data) => {
		filecheck = true;
		setTimeout(() => {filecheck = false}, 500);
	})

	window.api.loadprefs((data) => {
		console.log("prefs loaded");
		linecolor = data.color;
		bgpath = data.bg.replace(/\\/g, "/");
	})

	window.api.update((data) => {
		sys_data = writable(data);
	})

	window.api.status((data) => {
		status = data;
	})

	console.log(navigator.mediaSession);
	navigator.mediaSession.playbackState = "paused";
	console.log("TEST")
	
	
</script>

<main>
	<div class="bgimage" style="background-image: url({bgpath})"></div>
	<div id="stylecontainer" class="bgcontainer" style="{cssvars}">
		<div class="topmenu panel">
			<button on:click={getfile}>OPEN FOLDER</button>
			<button class="mbtn" on:click={refresh}>REFRESH</button>
			<button on:click={setbg}>SET BG</button>
			<input type="color" bind:value={linecolor} style="background-color:{linecolor}" on:change={savecolor}>
		</div>
		
		<div class="mainarea">
			{#if Object.keys($sys_data).length == 0}
				<Warn text="NO SYSTEM DATA" speed=60/>
			{:else if $sys_data.hyper == true}
				<Warn text="IN HYPERSPACE" speed=20/>
			{:else}
				<Sys bind:data={$sys_data} col={linecolor}/>
			{/if}

		</div>

		<div class="footer panel">
			<div class="footertext">{status}</div>
			{#if filecheck}
				<div class="footerimg"><svelte:component this={file_ico} size="16px" col={linecolor}/></div>
			{/if}
		</div>
	</div>
</main>

<style>
	#stylecontainer {
		position: relative;
		z-index: 2;
		color: var(--line-color, rgb(97, 214, 214));
		border-color: var(--line-color, rgb(97, 214, 214));
	}
</style>