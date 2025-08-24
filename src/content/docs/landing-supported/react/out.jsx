import _w_to_rt_ from 'wuchale/runtime'
import _w_load_ from "./loader.js"

const appName = "The app"

export function Greeting({username}) {
	const _w_runtime_ = _w_to_rt_(_w_load_('jsx'))
    return (
        <div>
            <p>{_w_runtime_.t(1)}</p>
            <p
				title={_w_runtime_.t(3)}
                class="paragraph"
            >
				{_w_runtime_.t(4, [appName, username])}
			</p>
        </div>
    )
}
