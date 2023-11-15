<script>
	import { page } from '$app/stores';
	import cart from '$lib/stores/cart';

	export let products;
	export let productSet;
	let filteredProducts = [];

	$: if (products && productSet) {
		const lowerProductSet = productSet.toLowerCase();
		filteredProducts = products.filter((product) => {
			const hasMatchingCategory = product.properties.category.some(
				(category) => category.toLowerCase() === lowerProductSet
			);
			return hasMatchingCategory;
		});
	}
</script>

{#if filteredProducts.length}
	{#each filteredProducts as product, index}
		{@const usps = product.properties.info}

		<article class="product">
			<div class="relative rounded-md overflow-hidden">
				{#if product.properties.image.url}
					<img
						src={product.properties.image.url}
						class="product__image"
						alt={product.properties.image.name}
					/>
				{/if}
				{#if product.properties.favorite}
					<div class="product__featured">Padellers favoriet</div>
				{/if}
				<svg
					class="absolute bottom-4 right-0"
					width="88"
					height="38"
					viewBox="0 0 88 38"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						d="M8.69205 5.90854L0 38H80C84.4183 38 88 34.4183 88 30V0H16.4138C12.801 0 9.63656 2.42139 8.69205 5.90854Z"
						fill="white"
					/>
				</svg>
				<div class="product__price">
					<span class="relative z-10 text-black">
						{product.properties.price}
					</span>
				</div>
			</div>

			<h3 class="product__title">
				{product.properties.title}
			</h3>

			<div class="pl-2">
				<div class="flex flex-wrap">
					{#each usps as usp}
						<span class="product__usp">{usp}</span>
					{/each}
				</div>
				<div class="flex flex-col gap-2 mt-6">
					{#if product.properties.overgrip}
						<span class="product__items">{product.properties.overgrip}</span>
					{/if}
					{#if product.properties.balls}
						<span class="product__items">{product.properties.balls}</span>
					{/if}
				</div>

				<button
					class="flex items-center button button-primary w-full sm:w-full mt-6"
					on:click|preventDefault={() => $cart.add(product)}
					data-sveltekit-noscroll
				>
					Toevoegen winkelmand
					<svg
						width="14"
						height="10"
						class="ml-2"
						viewBox="0 0 14 10"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							fill-rule="evenodd"
							clip-rule="evenodd"
							d="M9.159 7.70602C9.08531 7.77468 9.02621 7.85748 8.98522 7.94948C8.94423 8.04148 8.92218 8.1408 8.92041 8.2415C8.91863 8.3422 8.93716 8.44223 8.97488 8.53562C9.0126 8.62901 9.06874 8.71384 9.13996 8.78506C9.21118 8.85628 9.29601 8.91242 9.3894 8.95014C9.48279 8.98787 9.58282 9.00639 9.68352 9.00461C9.78423 9.00284 9.88354 8.98079 9.97554 8.9398C10.0675 8.89881 10.1503 8.83971 10.219 8.76602L13.47 5.51602L14 4.98602L13.47 4.45602L10.22 1.20602C10.0786 1.06933 9.8892 0.993649 9.69255 0.995264C9.4959 0.99688 9.30775 1.07567 9.16863 1.21466C9.02951 1.35365 8.95054 1.54172 8.94874 1.73837C8.94694 1.93502 9.02245 2.12451 9.159 2.26602L11.129 4.23602L0.75 4.23602C0.551087 4.23602 0.360323 4.31504 0.21967 4.45569C0.0790175 4.59634 -1.65748e-07 4.78711 -1.74443e-07 4.98602C-1.83137e-07 5.18493 0.0790174 5.3757 0.21967 5.51635C0.360323 5.657 0.551087 5.73602 0.75 5.73602L11.129 5.73602L9.159 7.70602Z"
							fill="#012242"
						/>
					</svg>
				</button>
				{#if $page.url.pathname !== '/padel-packs'}
					<a href="/padel-packs" class="product__info"> Meer informatie </a>
				{/if}
			</div>
		</article>
	{/each}
{:else}
	<p>Geen producten gevonden.</p>
{/if}

<style>
	.product__image {
		@apply w-full h-[240px] object-contain bg-[#16191B] mb-4 rounded-md;
	}
	.product__featured {
		@apply absolute top-0 right-0 bg-secondary text-white font-bold text-xs px-4 py-2;
	}
	.product__price {
		@apply absolute bottom-5 right-3 font-bold text-xl z-10;
	}
	.product__title {
		@apply font-bold text-2xl mb-2;
	}
	.product__usp {
		@apply border-r-2 last:border-r-0 text-xs border-primary pr-2 mr-2 last:pr-0 last:mr-0;
	}
	.product__items {
		@apply px-3 py-1.5 bg-white rounded-full text-black w-fit text-xs;
	}
	.product__info {
		@apply w-full flex justify-center text-gray-400 underline mt-4 text-sm;
	}
</style>
