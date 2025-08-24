const appName: string = 'The app'

export function Greeting(props: { username: string }) {
	return {
		greeting: `Hello`,
		title: 'Welcome message',
		message: `Welcome to ${appName}, ${props.username}!`,
	}
}
