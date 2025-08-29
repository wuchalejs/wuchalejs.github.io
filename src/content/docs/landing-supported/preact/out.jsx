// comment
import _w_to_rt_ from 'wuchale/runtime'
import _w_load_rx_, { get as _w_load_ } from "./loader.js"

export function Greeting({ username }) {
	const _w_runtime_ = _w_to_rt_(_w_load_rx_('jsx'))
	return (
		<div>
			<p>{_w_runtime_.t(0)}</p>
			<p title={_w_runtime_.t(1)} class="para">
				{_w_runtime_.t(2, [username])}
			</p>
		</div>
	)
}
