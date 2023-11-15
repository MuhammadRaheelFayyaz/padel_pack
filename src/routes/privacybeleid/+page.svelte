<script>
    import { page } from '$app/stores';

    const { blocks } = $page.data;
    const privacyContent = blocks.find(block => block.title === 'privacy-content')?.properties;
</script>

<section class="section !py-40">
    <div class="container">
        {#if privacyContent.title}
            <h1>{privacyContent.title}</h1>
        {/if}
        {#if privacyContent.content}
            {@html privacyContent.content}
        {/if}
    </div>
</section>