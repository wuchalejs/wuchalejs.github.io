import _w_to_rt_ from 'wuchale/runtime'
import _w_load_ from "./loader.js"

const appName = "The app"

export function Greeting(props) {
	const _w_runtime_ = _w_to_rt_(_w_load_('basic'))
	return {
		greeting: _w_runtime_.t(0),
		title: _w_runtime_.t(2),
		message: _w_runtime_.t(3, [appName, props.username]),
	}
}
