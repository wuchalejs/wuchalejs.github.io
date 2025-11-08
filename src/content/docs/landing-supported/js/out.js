import { getRuntime as _w_load_ } from "./main.loader.js"
// comment

export function Greeting(props) {
	const _w_runtime_ = _w_load_('main')
	return {
		greeting: _w_runtime_.t(0),
		title: _w_runtime_.t(1),
		message: _w_runtime_.t(2, [props.username]),
	}
}
