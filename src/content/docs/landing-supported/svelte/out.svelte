<script>
	import _w_to_rt_ from 'wuchale/runtime'
	import _w_load_ from "./loader.svelte.js"
	const _w_runtime_ = $derived(_w_to_rt_(_w_load_('svelte')))
	const { username } = $props()
</script>

<div>
	<p>{_w_runtime_.t(0)}</p>
	<p title={_w_runtime_.t(1)} class="para">
		{_w_runtime_.t(2, [username])}
	</p>
</div>
