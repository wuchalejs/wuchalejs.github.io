const appName = "The app"

export function Greeting(props) {
	return {
		greeting: `Hello`,
		title: 'Welcome message',
		message: `Welcome to ${appName}, ${props.username}!`,
	}
}
