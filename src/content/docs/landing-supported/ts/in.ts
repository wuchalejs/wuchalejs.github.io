// comment



export function Greeting(props: { username: string }) {

	return {
		greeting: `Hello`,
		title: 'Welcome',
		message: `Welcome ${props.username}!`,
	}
}
