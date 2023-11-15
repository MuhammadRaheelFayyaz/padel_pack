<script>
	import cart from '$lib/stores/cart';

	export let item;
	export let hasDiscount = false;
</script>

<!-- Show the banner with discount -->
<div class="banner">
	<div class="relative z-10">
		{#if item.product.properties.title}
			<h4 class="banner__title">{item.product.properties.title}</h4>
		{/if}
		{#if hasDiscount}
			<div class="pl-2 mb-2">
				<p>1e maand 50% korting</p>
			</div>
		{/if}
		<div class="flex items-baseline pl-4">
			{#if hasDiscount}
				<!-- Show the original price with a line to represent it -->
				<div class="relative">
					<span class="old-price font-bold text-lg">&euro; {item.price.toFixed(2)}</span>
					<span class="w-full h-[2px] block -rotate-[13deg] translate-y-[-12px] bg-[#767676]" />
				</div>
			{/if}
			<!-- Show the discounted price (50% off) in the font-bold text-lg text-green-lemon class -->
			<span class="font-bold text-lg text-green-lemon ml-1">
				&euro; {(hasDiscount ? item.discountPrice : item.price).toFixed(2)}
			</span>
		</div>
	</div>
	{#if item.product.properties.image}
		<img
			class="banner__image"
			src={item.product.properties.image.url}
			alt={item.product.properties.image.name}
		/>
	{/if}

	<button class="remove-button" on:click={() => $cart.remove(item.product)}>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 24 24"
			stroke-width="2"
			stroke="currentColor"
			class="w-3 h-3"
		>
			<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
		</svg>
	</button>
</div>

<style>
	.banner {
		@apply relative bg-[#16191B] p-6 rounded-lg text-white;
	}
	.banner__title {
		@apply text-base font-bold mb-1;
	}
	.banner__image {
		@apply absolute w-auto object-contain h-full bottom-0 top-0 right-8 opacity-70;
	}
	.remove-button {
		@apply absolute top-3 right-3 flex justify-center items-center w-5 h-5 rounded-full border border-white text-white hover:border-green-lemon hover:text-green-lemon;
	}
	.old-price {
		@apply text-[#767676];
	}
</style>
