import _w_to_rt_ from 'wuchale/runtime'
import _w_load_ from "./loader.js"
// comment

export function Greeting(props) {
	const _w_runtime_ = _w_to_rt_(_w_load_('vanilla'))
	return {
		greeting: _w_runtime_.t(0),
		title: _w_runtime_.t(1),
		message: _w_runtime_.t(2, [props.username]),
	}
}
