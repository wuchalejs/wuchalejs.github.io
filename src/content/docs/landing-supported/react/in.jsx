const appName = "The app"

export function Greeting({ username }) {
	return (
		<div>
			<p>Hello!</p>
			<p
				title="Welcome message"
				class="paragraph"
			>
				Welcome to {appName}, {username}!
			</p>
		</div>
	)
}
