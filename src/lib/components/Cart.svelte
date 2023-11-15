<script>
	import { slide } from 'svelte/transition';
	import cart from '$lib/stores/cart.js';
	import Banner from './Banner.svelte';
</script>

<div transition:slide={{ duration: 400 }} class="cart">
	<button class="cart__close" on:click={$cart.toggle}>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 24 24"
			stroke-width="2"
			stroke="currentColor"
			class="w-6 h-6"
		>
			<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
		</svg>
	</button>

	<div class="cart__body">
		<div>
			<h4 class="cart__title">Winkelmandje</h4>
			<p class="text-xs leading-5">
				Profiteer van <strong class="text-green-lemon">50% korting op je eerste box</strong> en ervaar
				het gemak van Padel Pack voor 3 maanden!
			</p>
			<div class="content text-green-lemon">
				<ul>
					<li>
						<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 9">
							<path
								fill="#46C410"
								fill-rule="evenodd"
								d="M9.159 6.71078c-.07369.06866-.13279.15146-.17378.24346s-.06304.19132-.06481.29202c-.00178.1007.01675.20073.05447.29412s.09386.17822.16508.24944.15605.12736.24944.16509c.09339.03772.19342.05624.29412.05446.10071-.00177.20002-.02381.29202-.06481.09196-.04099.17476-.10009.24346-.17378l3.251-3.25.53-.53-.53-.53L10.22.210782c-.1414-.1366863-.3308-.21237232-.52745-.21075685C9.4959.00164062 9.30775.0804287 9.16863.21942c-.13912.138991-.21809.327064-.21989.523711-.0018.196648.07371.386139.21026.527649l1.97 1.97H.75c-.198913 0-.389677.07902-.53033.21967C.0790175 3.6011-1.7e-7 3.79187-1.7e-7 3.99078c-1e-8 .19891.07901757.38968.21967017.53033.140653.14065.331417.21967.53033.21967h10.379l-1.97 1.97Z"
								clip-rule="evenodd"
							/>
						</svg>
						Krijg 1e pakket direct opgestuurd
					</li>
					<li>
						<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 9">
							<path
								fill="#46C410"
								fill-rule="evenodd"
								d="M9.159 6.71078c-.07369.06866-.13279.15146-.17378.24346s-.06304.19132-.06481.29202c-.00178.1007.01675.20073.05447.29412s.09386.17822.16508.24944.15605.12736.24944.16509c.09339.03772.19342.05624.29412.05446.10071-.00177.20002-.02381.29202-.06481.09196-.04099.17476-.10009.24346-.17378l3.251-3.25.53-.53-.53-.53L10.22.210782c-.1414-.1366863-.3308-.21237232-.52745-.21075685C9.4959.00164062 9.30775.0804287 9.16863.21942c-.13912.138991-.21809.327064-.21989.523711-.0018.196648.07371.386139.21026.527649l1.97 1.97H.75c-.198913 0-.389677.07902-.53033.21967C.0790175 3.6011-1.7e-7 3.79187-1.7e-7 3.99078c-1e-8 .19891.07901757.38968.21967017.53033.140653.14065.331417.21967.53033.21967h10.379l-1.97 1.97Z"
								clip-rule="evenodd"
							/>
						</svg>
						Flexibele bezorging
					</li>
					<li>
						<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 9">
							<path
								fill="#46C410"
								fill-rule="evenodd"
								d="M9.159 6.71078c-.07369.06866-.13279.15146-.17378.24346s-.06304.19132-.06481.29202c-.00178.1007.01675.20073.05447.29412s.09386.17822.16508.24944.15605.12736.24944.16509c.09339.03772.19342.05624.29412.05446.10071-.00177.20002-.02381.29202-.06481.09196-.04099.17476-.10009.24346-.17378l3.251-3.25.53-.53-.53-.53L10.22.210782c-.1414-.1366863-.3308-.21237232-.52745-.21075685C9.4959.00164062 9.30775.0804287 9.16863.21942c-.13912.138991-.21809.327064-.21989.523711-.0018.196648.07371.386139.21026.527649l1.97 1.97H.75c-.198913 0-.389677.07902-.53033.21967C.0790175 3.6011-1.7e-7 3.79187-1.7e-7 3.99078c-1e-8 .19891.07901757.38968.21967017.53033.140653.14065.331417.21967.53033.21967h10.379l-1.97 1.97Z"
								clip-rule="evenodd"
							/>
						</svg>
						Geen verzendkosten
					</li>
				</ul>
			</div>
			<div class="cart__items mt-8 h-full overflow-auto">
				{#each $cart.items as item (item.product.id)}
					{#each Array(item.quantity) as _, index (`${item.product.id}_${index}`)}
						<Banner {item} hasDiscount={item.hasDiscount && index === 0} />
					{/each}
				{:else}
					<div class="flex items-center justify-center text-center h-full">
						<h5 class="text-[#8E8E8E]">Geen items in je winkelmand</h5>
					</div>
				{/each}
			</div>
		</div>

		<div class="cart__footer">
			<div class="flex items-center justify-center font-bold gap-6 pb-4">
				<div class="flex items-center">
					<span>Verzending</span>
					<p class="ml-2 text-gray-500 font-normal">GRATIS</p>
				</div>
				<div class="flex items-center">
					<span>Totaal</span>
					<p class="ml-2 text-gray-500 font-normal whitespace-nowrap">
						&euro; {$cart.totalPrice.toFixed(2)}
					</p>
				</div>
			</div>

			<hr class="border-gray-100" />

			<div class="pt-6 px-0 flex justify-center w-full">
				<a href="/bestellen" class="button button-success !w-full" on:click={$cart.toggle}>
					Naar de kassa
				</a>
			</div>
		</div>
	</div>
</div>
<button class="overlay" on:click={$cart.toggle} />

<style lang="scss">
	.cart {
		@apply fixed bottom-0 top-auto lg:mt-0 right-0 left-0 h-[85vh] max-h-[85vh] md:h-screen md:top-0 md:min-h-screen bg-white z-[51] rounded-t-3xl text-black sm:max-w-[375px] overflow-auto sm:left-auto sm:h-screen sm:rounded-none;

		&__body {
			@apply flex flex-col justify-between pt-12 pb-6 px-8 h-full relative;
		}

		&__title {
			@apply text-3xl font-bold leading-[48px] mb-2;
		}

		&__items {
			@apply flex flex-col gap-1;
		}

		&__footer {
			@apply flex flex-col justify-center text-center border-t pt-4 pb-0 border-gray-100;
		}

		&__close {
			@apply absolute top-6 right-6 flex items-center justify-center rounded-full w-[35px] h-[35px] border-2 border-theme-dark-blue text-theme-dark-blue z-20;
		}
	}

	.overlay {
		@apply fixed inset-0 block bg-black/70 z-50 w-full h-screen;
	}
</style>
