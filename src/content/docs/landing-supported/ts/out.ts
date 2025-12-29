import { getRuntime as _w_load_ } from "./main.loader.js"
// comment

export function Greeting(props: { username: string }) {
	const _w_runtime_ = _w_load_('main')
	return {
		greeting: _w_runtime_(0),
		title: _w_runtime_(1),
		message: _w_runtime_(2, [props.username]),
	}
}
