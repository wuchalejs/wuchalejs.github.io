<script>
	import _w_to_rt_ from 'wuchale/runtime'
	import _w_load_ from "./loader.svelte.js"
	const _w_runtime_ = $derived(_w_to_rt_(_w_load_('svelte')))

    const appName = "The app"
    const {username} = $props()
</script>

<div>
    <p>{_w_runtime_.t(20)}</p>
    <p
        title={_w_runtime_.t(21)}
        class="paragraph"
    >
		{_w_runtime_.t(22, [appName, username])}
	</p>
</div>
