<script>
	import { page } from '$app/stores';
	import Hero from "$lib/components/Hero.svelte";
	import Carousel from "$lib/components/Carousel.svelte";
	import ProductPacks from "$lib/components/ProductPacks.svelte";	

    const { page: cp, blocks, products, reviews } = $page.data;
	const homeUSP = blocks.filter(block => block.title.startsWith('home-usp'));
	const heroData = blocks.find(block => block.title === 'home-intro')?.properties;
	const homeAbout = blocks.find(block => block.title === 'home-about')?.properties;
	const homeProducts = blocks.find(block => block.title === 'home-products')?.properties;
	const homeSubscription = blocks.find(block => block.title === 'home-subscription')?.properties;
	const reviewTitle = blocks.find(block => block.title === 'home-review-title')?.properties;
	const homeInfo = blocks.find(block => block.title === 'home-info')?.properties;
	const homeCTA = blocks.find(block => block.title === 'home-cta')?.properties;

	export let productSet = 'individueel';

	let uspTitle;
	let usps;
	if (homeUSP) {
		uspTitle = homeUSP.find(item => item.title === 'home-usp-title');
		usps = homeUSP.filter(item => item.title !== uspTitle.title);
	}
</script>

{#if heroData}
	<Hero data={heroData} />
{/if}

<!-- About -->
{#if homeAbout}
	<section class="section">
		<div class="container">
			<div class="flex flex-col md:grid md:grid-cols-2 md:items-center gap-12">
				<div class="content md:flex-1">
					{#if homeAbout.title}
						<header class="styled !mb-4">
							<h2 class="leading-10">{@html homeAbout.title}</h2>
						</header>
					{/if}
					{#if homeAbout.content}
						{@html homeAbout.content}
					{/if}

					{#if homeAbout.button_text}
						<div class="!text-sm italic text-gray-500">
							{@html homeAbout.button_text}
						</div>
					{/if}
				</div>
				{#if homeAbout.media[0].url}
					<div class="!text-sm italic text-gray-500">
						<img src={homeAbout.media[0].url} alt={homeAbout.media[0].name} class="w-full" />
					</div>
				{/if}
			</div>
		</div>
	</section>
{/if}

<!-- Products -->
{#if homeProducts}
	<section class="section">
		<div class="container">
			<div class="content max-w-[816px]">
				{#if homeProducts.title}
					<header class="styled">
						<h2>{homeProducts.title}</h2>
					</header>
				{/if}
				{#if homeProducts.content}
					{@html homeProducts.content}
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
			</div>
			<div class="grid grid-cols-1 lg:grid-cols-3 gap-24">
				<ProductPacks {products} {productSet} />
			</div>
		</div>
	</section>
{/if}

<!-- USPs -->
{#if usps}
	<section class="section">
		<div class="container">
			{#if uspTitle.properties.title}
				<header class="styled sm:w-full text-center !mb-10">
					<h2>{uspTitle.properties.title}</h2>
				</header>
			{/if}
			<div class="usp">
				{#each usps as usp}
					<div class="usp__item px-10 md:px-0">
						<div class="usp__icon">
							<img src={usp.properties.media[0].url} alt={usp.properties.media[0].name} class="w-10 h-10" />
						</div>
						{#if usp.properties.title}
							<h4 class="usp__title">
								{usp.properties.title}
							</h4>
						{/if}
						{#if usp.properties.content}
							<div class="content opacity-80">
								{@html usp.properties.content}
							</div>
						{/if}
					</div>
				{/each}
			</div>
		</div>
	</section>
{/if}

<!-- Subscription -->
{#if homeSubscription}
	<section class="section">
		<div class="container">
			<div class="flex flex-col md:flex-row justify-around items-center gap-12 lg:gap-20">
				<div>
					<img src={homeSubscription.media[0].url} alt={homeSubscription.media[0].name} class="w-full max-w-md" />
				</div>
				<div class="content w-full lg:w-2/4">
					{#if homeSubscription.title}
						<header class="styled">
							<h2>{@html homeSubscription.title}</h2>
						</header>
					{/if}
					{#if homeSubscription.content}
						{@html homeSubscription.content}
					{/if}
				</div>
			</div>
		</div>
	</section>
{/if}

<!-- Reviews -->
{#if reviews}
	<section class="section">
		<div class="container">
			{#if reviewTitle.title}
				<header class="styled">
					<h2>{reviewTitle.title}</h2>
				</header>
			{/if}
		</div>
		<Carousel 
			data={reviews}
		/>
	</section>
{/if}

<!-- Info -->
{#if homeInfo}
	<section class="section">
		<div class="container">
			<div class="flex flex-col md:grid md:grid-cols-2 md:items-center gap-12">
				<div class="content">
					{#if homeInfo.title}
						<header class="styled">
							<h2>{@html homeInfo.title}</h2>
						</header>
					{/if}
					{#if homeInfo.content}
						{@html homeInfo.content}
					{/if}
					{#if homeInfo.button_url}
						<a href={homeInfo.button_url} class="flex items-center button button-primary mt-10">
							{homeInfo.button_text}
							<svg width="14" height="10" class="ml-2" viewBox="0 0 14 10" fill="none" xmlns="http://www.w3.org/2000/svg">
								<path fill-rule="evenodd" clip-rule="evenodd" d="M9.159 7.70614C9.08531 7.77481 9.02621 7.85761 8.98522 7.94961C8.94423 8.04161 8.92218 8.14092 8.92041 8.24162C8.91863 8.34232 8.93716 8.44235 8.97488 8.53574C9.0126 8.62913 9.06874 8.71396 9.13996 8.78518C9.21118 8.8564 9.29601 8.91255 9.3894 8.95027C9.48279 8.98799 9.58282 9.00651 9.68352 9.00474C9.78423 9.00296 9.88354 8.98092 9.97554 8.93993C10.0675 8.89893 10.1503 8.83983 10.219 8.76614L13.47 5.51614L14 4.98614L13.47 4.45614L10.22 1.20614C10.0786 1.06946 9.8892 0.993771 9.69255 0.995386C9.4959 0.997002 9.30775 1.07579 9.16863 1.21478C9.02951 1.35377 8.95054 1.54185 8.94874 1.73849C8.94694 1.93514 9.02245 2.12463 9.159 2.26614L11.129 4.23614L0.75 4.23614C0.551087 4.23614 0.360323 4.31516 0.21967 4.45581C0.0790175 4.59647 -1.65748e-07 4.78723 -1.74443e-07 4.98614C-1.83137e-07 5.18506 0.0790174 5.37582 0.21967 5.51647C0.360323 5.65713 0.551087 5.73614 0.75 5.73614L11.129 5.73614L9.159 7.70614Z" fill="#012242"/>
							</svg>
						</a>
					{/if}
				</div>
				{#if homeInfo.media[0].url}
					<div>
						<img src={homeInfo.media[0].url} alt="example" class="w-full" />
					</div>
				{/if}
			</div>
		</div>
	</section>
{/if}

<!-- CTA -->
{#if homeCTA}
	<section class="relative section bg-[#1C1C1C] py-10 px-4">
		<div class="container relative z-10">
			<div class="content text-center max-w-sm mx-auto">
				{#if homeCTA.title}
					<h2 class="sm:mb-4">{homeCTA.title}</h2>
				{/if}
				{#if homeCTA.content}
					{@html homeCTA.content}
				{/if}
				{#if homeCTA.button_url}
					<a href={homeCTA.button_url} class="button button-primary mt-10 mx-auto">
						{homeCTA.button_text}
					</a>
				{/if}
			</div>
		</div>
		{#if homeCTA.media[0].url}
			<img src={homeCTA.media[0].url} alt={homeCTA.media[0].name} class="hidden md:block absolute bottom-0 md:h-40 lg:h-80 left-10" />
		{/if}
		{#if homeCTA.media[1].url}
			<img src={homeCTA.media[1].url} alt={homeCTA.media[1].name} class="hidden md:block absolute bottom-0 md:h-40 lg:h-80 right-10" />
		{/if}
	</section>
{/if}

<style>
	.usp {
		@apply grid grid-cols-1 lg:grid-cols-3 gap-12;
	}
	.usp__item {
		@apply flex flex-col text-center justify-center sm:text-left;
	}
	.usp__icon {
		@apply w-8 mx-auto sm:ml-0 mb-3;
	}
	.usp__title {
		@apply text-base mb-2;
	}
	.active-tab {
		@apply bg-primary text-black border-primary;
	}
</style>