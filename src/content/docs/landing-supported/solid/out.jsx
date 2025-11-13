// comment
import { getRuntimeRx as useW_load_rx_, getRuntime as _w_load_ } from "./main.loader.js"
import W_tx_ from "@wuchale/jsx/runtime.solid.jsx"

const _w_runtime_ = () => useW_load_rx_('main')
export function Greeting({ username }) {
	return (
		<div>
			<p>{_w_runtime_().t(0)}</p>
			<p title={_w_runtime_().t(1)} class="para">
				<W_tx_ x={_w_runtime_().cx(2)} a={[username]} />
			</p>
		</div>
	)
}
