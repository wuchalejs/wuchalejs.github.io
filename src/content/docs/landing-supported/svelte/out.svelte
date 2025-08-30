<script>
	import _w_to_rt_ from 'wuchale/runtime'
	import _w_load_rx_, { get as _w_load_ } from "./loader.svelte.js"
	import W_tx_ from "@wuchale/svelte/runtime.svelte"
	const _w_runtime_ = $derived(_w_to_rt_(_w_load_rx_('svelte')))
	const { username } = $props()
</script>

<div>
	<p>{_w_runtime_.t(0)}</p>
	<p title={_w_runtime_.t(1)} class="para">
		<W_tx_ x={_w_runtime_().cx(2)} a={[username]} />
	</p>
</div>
