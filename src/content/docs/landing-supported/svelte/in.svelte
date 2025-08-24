<script>
    const appName = "The app"
    const {username} = $props()
</script>

<div>
    <p>Hello!</p>
    <p
        title="Welcome message"
        class="paragraph"
    >
        Welcome to {appName}, {username}!
    </p>
</div>
