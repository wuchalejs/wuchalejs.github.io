<script>
	import { getRuntimeRx as _w_load_rx_, getRuntime as _w_load_ } from "./main.loader.svelte.js"
	import W_tx_ from "@wuchale/svelte/runtime.svelte"
	const _w_runtime_ = $derived(_w_load_rx_('main'))
	const { username } = $props()
</script>

<div>
	<p>{_w_runtime_(0)}</p>
	<p title={_w_runtime_(1)} class="para">
		<W_tx_ x={_w_runtime_.c(2)} a={[username]} />
	</p>
</div>
