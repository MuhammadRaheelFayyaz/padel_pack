<script>
    import { page } from '$app/stores';

    const { blocks } = $page.data;
    const agreementContent = blocks.find(block => block.title === 'agreement-content')?.properties;
</script>

<section class="section !py-40">
    <div class="container">
        {#if agreementContent.title}
            <h1>{agreementContent.title}</h1>
        {/if}
        {#if agreementContent.content}
            {@html agreementContent.content}
        {/if}
    </div>
</section>