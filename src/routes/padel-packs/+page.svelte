<script>
    import { page } from '$app/stores';
	import Carousel from "$lib/components/Carousel.svelte";
	import FaqItem from "$lib/components/FaqItem.svelte";
	import PackAdvice from "$lib/components/PackAdvice.svelte";
	import ProductPacks from "$lib/components/ProductPacks.svelte";	
	import { onMount } from 'svelte';

    const { page: cp, blocks, products, reviews, faqs } = $page.data;
	const packsIntro = blocks.find(block => block.title === 'packs-intro')?.properties;
	const packsIntroduction = blocks.filter(block => block.title.startsWith('packs-introduction-block-'));
    const packsIntroductionTitle = blocks.find(block => block.title === 'packs-introduction-title')?.properties;
	const productsTitle = blocks.find(block => block.title === 'packs-product-title')?.properties;
	const packsSubscription = blocks.find(block => block.title === 'packs-subscription')?.properties;
	const reviewsTitle = blocks.find(block => block.title === 'packs-reviews')?.properties;
	const packsCTA = blocks.find(block => block.title === 'packs-cta')?.properties;
	
    export let productSet = 'individueel';
    let scrollToSection;
    let currentCategory = null;
    let categories = new Set();

    if (faqs) {
        faqs.forEach(element => {
        categories.add(element.properties.category[0]);
        });
    }

    let uniqueCategories = Array.from(categories);

    function setCategory(index) {
        currentCategory = index;
    }

    if (currentCategory === null) {
        currentCategory = uniqueCategories.indexOf("Algemeen");
    }

    onMount(() => {
        scrollToSection = (url) => {
            const targetId = url.split("#")[1];
            if (targetId) {
                const target = document.querySelector(`#${targetId}`);
                if (target) {
                    const targetPosition = target.getBoundingClientRect().top;
                    const offset = window.innerHeight / 3;
                    const scrollToPosition = window.scrollY + targetPosition - offset;
                    window.scrollTo({
                        top: scrollToPosition,
                        behavior: "smooth"
                    });
                }
            }
        };
    });
</script>

<!-- Intro -->
{#if packsIntro}
    <section class="section pt-16 lg:pt-32">
        <div class="container">
            <div class="flex flex-col-reverse md:grid md:grid-cols-2 md:items-center gap-12">
                <div class="content">
                    {#if packsIntro.title}
                        <header class="styled">
                            <h1>{packsIntro.title}</h1>
                        </header>
                    {/if}
                    {#if packsIntro.content}
                        <div class="text-base lg:!text-lg lg:!leading-[27px]">
                            {@html packsIntro.content}
                        </div>
                    {/if}
                    {#if packsIntro.button_url}
                        <button on:click={() => scrollToSection(packsIntro.button_url)} class="button button-primary mt-10">
                            {packsIntro.button_text}
                        </button>
                    {/if}
                </div>
                {#if packsIntro.media[0].url}
                    <div>
                        <img src={packsIntro.media[0].url} alt={packsIntro.media[0].name} class="w-full object-contain mt-8 lg:mt-0" />
                    </div>
                {/if}
            </div>
        </div>
    </section>
{/if}

<!-- How it Works -->
{#if packsIntroduction}
    <section class="section">
        <div class="container">
            <header class="styled md:flex md:flex-col md:justify-center md:text-center md:!mb-11 w-fit mx-auto">
                {#if packsIntroductionTitle.title}
                    <h2>
                        {packsIntroductionTitle.title}
                    </h2>
                {/if}
                {#if packsIntroduction}
                    <div class="relative">
                        <h5 class="!text-lg text-primary hidden lg:block">50% korting 1e besteling</h5>
                        <svg xmlns="http://www.w3.org/2000/svg" class="hidden lg:flex absolute right-0 top-2 w-14" fill="none" viewBox="0 0 68 68">
                            <g clip-path="url(#a)">
                            <path fill="#F7F72C" fill-rule="evenodd" d="M50.9647 53.511C45.4315 16.2261 16.6195 7.75146 16.6195 7.75146c-.7847-.2328-1.6113.21394-1.8452.99928-.2336.78448.214 1.61136.9993 1.84516 0 0 27.8723 8.4 32.4877 45.0387-1.8504-1.3385-3.4802-2.8715-5.2525-4.3084-.6363-.5153-1.571-.4181-2.0872.218-.5153.6364-.4173 1.5713.218 2.0873 1.9746 1.5999 3.7832 3.3101 5.8862 4.7643.2117.1464 1.975 1.3463 2.433 1.4824.7989.2371 1.3082-.1262 1.5523-.3683.8369-.8297 1.502-1.9767 2.0501-3.2326.699-1.601 1.2091-3.3861 1.7997-4.6831.3387-.7453.0097-1.6254-.7354-1.965-.7453-.3388-1.6265-.0091-1.9652.7362-.4062.8923-.7781 2.0105-1.1956 3.1456Z" clip-rule="evenodd"/>
                            </g>
                            <defs>
                            <clipPath id="a">
                                <path fill="#fff" d="M67.8348 13.2942 54.54025049 67.83477077-.00032028 54.54022125 13.29422923-.0003495z"/>
                            </clipPath>
                            </defs>
                        </svg>
                    </div>
                {/if}
            </header>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {#each packsIntroduction as block, index}
                    <div 
                        class="bg-[#181818] px-4 py-6 rounded-md border-2 content {index === 2 ? 'border-primary' : 'border-[#181818]'}"
                        class:active-block={block.properties.featured === true}
                    >
                        {#if block.properties.media[0].url}
                            <div class="flex items-center gap-2 mb-4">
                                <img src={block.properties.media[0].url} alt={block.properties.media[0].name} class="w-8 h-8" />
                                {#if index === 2}
                                    <span class="sm:hidden font-bold text-primary">50% korting op je 1e bestelling</span>
                                {/if}
                            </div>
                        {/if}
                        {#if block.properties.title}
                            <h4 class="text-base font-bold mb-2">{ block.properties.title}</h4>
                        {/if}
                        {#if block.properties.content}
                            <div class="!text-sm opacity-80">{@html block.properties.content}</div>
                        {/if}
                    </div>
                {/each}
            </div>
        </div>
    </section>
{/if}

<!-- Padel Pack Questions -->
<section class="section" id="packAdvice">
    <div class="container">
		<PackAdvice />
    </div>
</section>

<!-- Products -->
{#if products}
    <section class="section">
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


<!-- Subscription -->
{#if packsSubscription}
    <section class="section">
        <div class="container">
            <div class="flex flex-col md:flex-row justify-around items-center gap-12 lg:gap-20">
                {#if packsSubscription.media[0].url}
                    <div>
                        <img src={packsSubscription.media[0].url} alt={packsSubscription.media[0].name} class="w-full max-w-md" />
                    </div>
                {/if}
                <div class="content w-full lg:w-2/4">
                    {#if packsSubscription.title}
                        <header class="styled">
                            <h2>{packsSubscription.title}</h2>
                        </header>
                    {/if}
                    {#if packsSubscription.content}
                        {@html packsSubscription.content}
                    {/if}
                </div>
            </div>
        </div>
    </section>
{/if}

<!-- Reviews -->
{#if reviews}
    <section class="section">
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

<!-- Faq -->
{#if faqs}
    <section class="section">
        <div class="container">
            <header class="styled">
                <h2 class="mb-5">Informatiecentrum</h2>

                <div class="categories">
                    {#each uniqueCategories as item, index}
                        <button
                            class="button whitespace-nowrap"
                            class:active-faq={index == currentCategory}
                            class:button-primary={item === currentCategory}
                            on:click={() => setCategory(index)}
                        >
                            {item}
                        </button>
                    {/each}
                    <div class="absolute top-0 bottom-0 right-0 w-1/2 lg:hidden bg-gradient-to-r from-transparent to-black pointer-events-none"></div>
                </div>
            </header>
            <div class="faq-items">
                {#each faqs as item, index}
                    {#if currentCategory === index || uniqueCategories[currentCategory] === item.properties.category[0]}
                        <div class="w-1/2">
                            <FaqItem
                                question={item.properties.question}
                                answer={item.properties.answer}
                            />
                        </div>
                    {/if}
                {/each}
            </div>
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
    .active-block {
        @apply border-primary;
    }
    .faq-items {
        @apply flex flex-col md:flex-row flex-wrap divide-y divide-white/10;

    }
    .faq-items > div {
       @apply w-full md:w-1/2 overflow-hidden;
    }

    .active-faq {
        @apply bg-primary text-black border-primary;
    }
    .categories {
        @apply flex overflow-auto gap-4 mb-14;
    }
    .active-tab {
		@apply bg-primary text-black border-primary;
	}
</style>