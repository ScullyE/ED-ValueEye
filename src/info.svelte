<script>
    export let info = {};
    export let level = 2;
    export let indent = level*32;
</script>

<div class="infobox panel" style="margin-left:{indent}px;">
    {info.name}
</div>

<style>
    .infobox{
        border-top-left-radius: 0;
        border-top-right-radius: 0;
        border-bottom-right-radius: 16px;
        border-bottom-left-radius: 16px;
        
        height:96px;
        background-color: rgba(24, 24, 24, 0.6);
    }
</style>