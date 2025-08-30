// comment
import _w_to_rt_ from 'wuchale/runtime'
import _w_load_rx_, { get as _w_load_ } from "./loader.js"
import W_tx_ from "@wuchale/jsx/runtime.solid.jsx"

const _w_runtime_ = () => _w_to_rt_(_w_load_rx_('jsx'))
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
