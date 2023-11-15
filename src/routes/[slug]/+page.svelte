<script>
    import { page } from '$app/stores';
	import PackAdvice from "$lib/components/PackAdvice.svelte";
	import ProductPacks from "$lib/components/ProductPacks.svelte";	
	import Carousel from '$lib/components/Carousel.svelte';
    const { page: cp, products, blocks, reviews, seoPages, seoPage } = $page.data;

    $: currentPageData = seoPages.find(page_ => page_.properties.pathname.replace('/', '') === $page.params.slug)?.properties;

    const productsTitle = blocks.find(block => block.title === 'packs-product-title')?.properties;
    const reviewsTitle = blocks.find(block => block.title === 'packs-reviews')?.properties;
    const packsCTA = blocks.find(block => block.title === 'packs-cta')?.properties;
    export let productSet = 'individueel';
</script>

<!-- Intro -->
{#if currentPageData.intro_title}
    <section class="section pt-20 lg:pt-32">
        <div class="container">
            <div class="flex flex-col-reverse md:grid md:grid-cols-2 md:items-center gap-12">
                <div class="content">
                    {#if currentPageData.intro_title}
                        <header class="styled">
                            <h1>{currentPageData.intro_title}</h1>
                        </header>
                    {/if}
                    {#if currentPageData.intro_description}
                        <div class="text-base lg:!text-lg lg:!leading-[27px]">
                            {@html currentPageData.intro_description}
                        </div>
                    {/if}
                    {#if currentPageData.intro_button_url}
                        <a href={currentPageData.intro_button_url} class="button button-primary mt-10">
                            {currentPageData.intro_button_text}
                        </a>
                    {/if}
                </div>
                {#if currentPageData.intro_image}
                    <div>
                        <img 
                            src={currentPageData.intro_image.url} 
                            alt={currentPageData.intro_image.name} 
                            class="w-full object-contain" 
                        />
                    </div>
                {/if}
            </div>
        </div>
    </section>
{/if}

{#if currentPageData.block_2}
    <section class="pb-20 lg:pb-32 !pt-0">
        <div class="container">
            <div class="max-w-5xl mx-auto">
                {@html currentPageData.block_2}
            </div>
        </div>
    </section>
{/if}

{#if currentPageData.block_3_content}
    <section class="section pb-16 lg:pb-32 !pt-0">
        <div class="container">
            <div class="flex flex-col md:grid md:grid-cols-2 md:items-center gap-12">
                {#if currentPageData.block_3_image}
                    <div>
                        <img src={currentPageData.block_3_image.url} alt={currentPageData.block_3_image.name} class="w-full object-contain" />
                    </div>
                {/if}
                <div class="content">
                    {#if currentPageData.block_3_content}
                        <div class="text-base lg:!text-lg lg:!leading-[27px]">
                            {@html currentPageData.block_3_content}
                        </div>
                    {/if}
                    {#if currentPageData.block_3_button_url}
                        <a href={currentPageData.block_3_button_url} class="button button-primary mt-10">
                            {currentPageData.block_3_button_text}
                        </a>
                    {/if}
                </div>
            </div>
        </div>
    </section>
{/if}

<!-- Padel Pack Questions -->
<section class="pb-20 lg:pb-32 !pt-0">
    <div class="container">
		<PackAdvice />
    </div>
</section>

<!-- {#if currentPageData.block_4_content}
    <section class="section pb-16 lg:pb-32 !pt-0">
        <div class="container">
            <div class="flex flex-col md:grid md:grid-cols-2 md:items-center gap-12">
                <div class="content">
                    {#if currentPageData.block_4_content}
                        <div class="text-base lg:!text-lg lg:!leading-[27px]">
                            {@html currentPageData.block_4_content}
                        </div>
                    {/if}
                    {#if currentPageData.block_4_button_url}
                        <a href={currentPageData.block_4_button_url} class="button button-primary mt-10">
                            {currentPageData.block_4_button_text}
                        </a>
                    {/if}
                </div>
                {#if currentPageData.block_4_image}
                    <div>
                        <img src={currentPageData.block_4_image.url} alt={currentPageData.block_4_image.name} class="w-full object-contain" />
                    </div>
                {/if}
            </div>
        </div>
    </section>
{/if} -->
<!-- 
{#if currentPageData.block_5}
    <section class="pb-20 lg:pb-32 !pt-0">
        <div class="container">
            <div class="max-w-5xl mx-auto">
                {@html currentPageData.block_5}
            </div>
        </div>
    </section>
{/if} -->

<!-- Products -->
{#if products}
    <section class="pb-20 lg:pb-32 !pt-0">
        <div class="container">
            {#if productsTitle}
                <div class="content max-w-[816px] mb-8">
                    {#if productsTitle.title}
                        <header class="styled">
                            <h2>{productsTitle.title}</h2>
                        </header>
                    {/if}
                    {#if productsTitle.content}
                        {@html productsTitle.content}
                    {/if}
                </div>
            {/if}

            <div class="flex items-center gap-4 mb-8 mt-10">
                <button 
                    class="button"
                    class:active-tab={productSet === 'individueel'}
                    on:click={() => productSet = 'individueel'}
                >
                    Voor individu
                </button>
                <button 
                    class="button"
                    class:active-tab={productSet === 'teams'}
                    on:click={() => productSet = 'teams'}
                >
                    Voor teams
                </button>
            </div>
        
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-24">
                <ProductPacks {products} {productSet} />
            </div>
        </div>
    </section>
{/if}

<!-- Reviews -->
{#if reviews}
    <section class="pb-20 lg:pb-32 !pt-0">
        {#if reviewsTitle.title}
            <div class="container">
                <header class="styled">
                    <h2>{reviewsTitle.title}</h2>
                </header>
            </div>
        {/if}
        <div>
            <Carousel 
                data={reviews}
            />
        </div>
    </section>
{/if}

<!-- CTA -->
{#if packsCTA}
    <section class="relative section bg-[#1C1C1C] py-10 px-4">
        <div class="container relative z-10">
            <div class="content text-center max-w-xs mx-auto">
                {#if packsCTA.title}
                    <h2 class="sm:mb-4">{@html packsCTA.title}</h2>
                {/if}
                {#if packsCTA.content}
                    <div class="!text-xl">
                        {@html packsCTA.content}
                    </div>
                {/if}
                {#if packsCTA.button_url}
                    <a href={ packsCTA.button_url} class="button button-primary mt-10 mx-auto">
                       {packsCTA.button_text}
                    </a>
                {/if}
            </div>
        </div>
        {#if packsCTA.media[0].url}
			<img src={packsCTA.media[0].url} alt={packsCTA.media[0].name} class="hidden md:block absolute bottom-0 md:h-40 lg:h-80 left-10" />
		{/if}
		{#if packsCTA.media[1].url}
			<img src={packsCTA.media[1].url} alt={packsCTA.media[1].name} class="hidden md:block absolute bottom-0 md:h-40 lg:h-80 right-10" />
		{/if}
    </section>
{/if}

<style>
    .active-tab {
		@apply bg-primary text-black border-primary;
	}
</style>