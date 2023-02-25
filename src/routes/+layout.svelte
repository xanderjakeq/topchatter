<script>
    import '../app.css';
</script>

<slot />

<style lang="postcss">
    :global(html) {
        background-color: theme(colors.purple.500);
    }
</style>
