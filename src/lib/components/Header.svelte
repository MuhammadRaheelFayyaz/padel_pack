<script>
	import cart from '$lib/stores/cart';
	import { getTheme } from '$lib/utilities/darkMode.js';
	import { page } from '$app/stores';
	import { slide } from 'svelte/transition';
	import { onMount } from 'svelte';
	import Logo from './Logo.svelte';
	import Cart from './Cart.svelte';
	import customer from '$lib/stores/customer';

	export let menuIsOpen = false;
	let scrolled = false;
	let userMenuIsOpen = false;

	$: theme = getTheme($page.url.pathname);

	function handleScroll() {
		scrolled = scrollY > 50;
	}

	onMount(() => {
		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	});

	const navigation = [
		{
			title: 'Home',
			href: '/',
			active: false
		},
		{
			title: 'Padel Packs',
			href: '/padel-packs',
			active: false
		},
		{
			title: 'Contact',
			href: '/contact',
			active: false
		},
		{
			title: 'Veelgestelde vragen',
			href: '/veelgestelde-vragen',
			active: false
		},
		{
			title: 'Account',
			href: '/account',
			active: false
		}
	];
	
	const userMenu = [
		{
			title: 'Overzicht',
			href: '/account'
		},
		{
			title: 'Accountgegevens',
			href: '/account/gegevens'
		},
		{
			title: 'Bestellingen',
			href: '/account/bestellingen'
		}
	];
</script>

<header
	class="header {scrolled ? 'scrolled' : ''}"
	class:theme-dark={theme === 'dark'}
	class:theme-light={theme === 'light'}
>
	<div class="container">
		<div class="flex items-center justify-between">
			<!-- Menu -->
			<button class="xl:hidden !text-base" on:click={() => (menuIsOpen = true)}> Menu </button>

			<div class="flex items-center gap-12">
				<!-- Logo -->
				<Logo {theme} />

				<!-- Navigation desktop -->
				<div class="hidden xl:flex">
					<ul class="flex items-center gap-8">
						{#each navigation as item}
							{#if item.title.toLowerCase() !== 'account'}
								<li>
									<a href={item.href}>
										{item.title}
									</a>
								</li>
							{/if}
						{/each}
					</ul>
				</div>
			</div>

			<div class="flex items-center gap-x-6">
				<a href="/padel-packs" class="!hidden md:!block button button-primary !text-sm !px-4">
					Ontdek het aanbod
				</a>

				<div class="relative hidden md:flex">
					<!-- Account -->
                    {#if !$customer.isAuthenticated}
                        <a href="/account" class="hidden md:flex flex-col items-center text-theme-dark-blue">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                class="w-7 h-7"
                                class:text-white={theme === 'dark'}
                                class:text-theme-dark-blue={theme === 'light'}
                            >
                                <path
                                    fill-rule="evenodd"
                                    d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z"
                                    clip-rule="evenodd"
                                />
                            </svg>
                            <span
								class="text-xs"
								class:text-white={theme === 'dark'}
                                class:text-theme-dark-blue={theme === 'light'}
							>
								Inloggen
							</span>
                        </a>

                        {:else}
                            <button 
								on:click={() => userMenuIsOpen = !userMenuIsOpen} 
								class="hidden md:flex flex-col items-center text-theme-dark-blue"
							>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                    class="w-7 h-7"
                                    class:text-white={theme === 'dark'}
                                    class:text-theme-dark-blue={theme === 'light'}
                                >
                                    <path
                                        fill-rule="evenodd"
                                        d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z"
                                        clip-rule="evenodd"
                                    />
                                </svg>
                                <span 
									class="text-xs"
									class:text-white={theme === 'dark'}
                                	class:text-theme-dark-blue={theme === 'light'}
								>
									{#if $customer.first_name}
										{$customer.first_name}

										{:else}
										Account
									{/if}
								</span>
                            </button>
                    {/if}

					{#if userMenuIsOpen}
                        <div class="menu__user">
                            <ul class="divide-y-2 divide-gray-100">
                                {#each userMenu as item}
                                    <li class="py-2">
                                        <a
                                            href={item.href}
                                            class:link-active={item.href === $page.url.pathname.toLowerCase()}
                                            on:click={() => (userMenuIsOpen = false)}
                                        >
                                            {item.title}
                                        </a>
                                    </li>
                                {/each}
                                <li class="py-2">
                                    <button
                                        on:click={() => $customer.logout()}
                                    > Uitloggen </button>
                                </li>
                            </ul>
                        </div>
					{/if}
				</div>

				<!-- Cart -->
				<button
					transition:slide={{ duration: 400 }}
					class="flex flex-col items-center text-theme-dark-blue"
					data-sveltekit-noscroll
					on:click={$cart.toggle}
				>
					<div 
						class="relative"
					>
						<!-- {#if $cart.items.length}
							<div class="cart-label">
								{$cart.items.length}
							</div>
						{/if} -->
						<svg
							class="w-5"
							viewBox="0 0 20 27"
							fill="currentColor"
							xmlns="http://www.w3.org/2000/svg"
                            class:text-white={theme === 'dark'}
							class:text-theme-dark-blue={theme === 'light'}
						>
							<path
								d="M10 0C8.53921 0 7.13826 0.568927 6.10532 1.58162C5.07239 2.59432 4.49209 3.96783 4.49209 5.4V6.3H3.73017C2.95733 6.2992 2.21396 6.59067 1.6548 7.11372C1.09565 7.63677 0.763809 8.3511 0.728358 9.108L0.00315065 23.913C-0.0154399 24.3111 0.0483851 24.7088 0.190778 25.0821C0.333172 25.4554 0.551184 25.7965 0.831675 26.085C1.11217 26.3734 1.44933 26.6032 1.82284 26.7605C2.19634 26.9177 2.59847 26.9992 3.00496 27H16.995C17.4015 26.9992 17.8037 26.9177 18.1772 26.7605C18.5507 26.6032 18.8878 26.3734 19.1683 26.085C19.4488 25.7965 19.6668 25.4554 19.8092 25.0821C19.9516 24.7088 20.0154 24.3111 19.9969 23.913L19.2716 9.108C19.2362 8.3511 18.9043 7.63677 18.3452 7.11372C17.786 6.59067 17.0427 6.2992 16.2698 6.3H15.5079V5.4C15.5079 3.96783 14.9276 2.59432 13.8947 1.58162C12.8617 0.568927 11.4608 0 10 0ZM6.32806 5.4C6.32806 4.44522 6.71493 3.52955 7.40355 2.85442C8.09217 2.17928 9.02614 1.8 10 1.8C10.9739 1.8 11.9078 2.17928 12.5965 2.85442C13.2851 3.52955 13.6719 4.44522 13.6719 5.4V6.3H6.32806V5.4ZM17.4357 9.189L18.1609 24.003C18.1666 24.1578 18.1412 24.3122 18.0861 24.4573C18.031 24.6025 17.9472 24.7356 17.8396 24.849C17.7297 24.9596 17.5984 25.0477 17.4534 25.1079C17.3084 25.1682 17.1525 25.1995 16.995 25.2H3.00496C2.84745 25.1995 2.69163 25.1682 2.54661 25.1079C2.4016 25.0477 2.2703 24.9596 2.16041 24.849C2.0528 24.7356 1.96904 24.6025 1.91391 24.4573C1.85878 24.3122 1.83336 24.1578 1.83912 24.003L2.56433 9.189C2.57849 8.89531 2.70755 8.61827 2.92467 8.41546C3.14179 8.21265 3.43028 8.09967 3.73017 8.1H16.2698C16.5697 8.09967 16.8582 8.21265 17.0753 8.41546C17.2924 8.61827 17.4215 8.89531 17.4357 9.189Z"
								fill="currentColor"
							/>
							<path d="M18 7.5H2L1.5 25.5H18.5L18 7.5Z" fill="currentColor" />
						</svg>
					</div>
					<span 
						class="hidden md:block text-xs"
						class:text-white={theme === 'dark'}
                        class:text-theme-dark-blue={theme === 'light'}
					>
						Winkemand
					</span>
				</button>
			</div>
		</div>
	</div>
	{#if menuIsOpen}
		<div transition:slide={{ duration: 400 }} class="menu__navigation">
			<div class="flex items-center justify-between relative">
				<!-- Menu -->
				<button class="hover:text-black/50" on:click={() => (menuIsOpen = false)}>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 24 24"
						fill="currentColor"
						class="w-6 h-6"
					>
						<path
							fill-rule="evenodd"
							d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z"
							clip-rule="evenodd"
						/>
					</svg>
				</button>

				<!-- Logo -->
				<div>
					<Logo />
				</div>

				<!-- Cart -->
				<div class="relative">
					{#if $cart.totalPrice}
						<div class="cart-label">
							{$cart.totalPrice}
						</div>
					{/if}

					<svg
						class="w-5"
						viewBox="0 0 20 27"
						fill="currentColor"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							d="M10 0C8.53921 0 7.13826 0.568927 6.10532 1.58162C5.07239 2.59432 4.49209 3.96783 4.49209 5.4V6.3H3.73017C2.95733 6.2992 2.21396 6.59067 1.6548 7.11372C1.09565 7.63677 0.763809 8.3511 0.728358 9.108L0.00315065 23.913C-0.0154399 24.3111 0.0483851 24.7088 0.190778 25.0821C0.333172 25.4554 0.551184 25.7965 0.831675 26.085C1.11217 26.3734 1.44933 26.6032 1.82284 26.7605C2.19634 26.9177 2.59847 26.9992 3.00496 27H16.995C17.4015 26.9992 17.8037 26.9177 18.1772 26.7605C18.5507 26.6032 18.8878 26.3734 19.1683 26.085C19.4488 25.7965 19.6668 25.4554 19.8092 25.0821C19.9516 24.7088 20.0154 24.3111 19.9969 23.913L19.2716 9.108C19.2362 8.3511 18.9043 7.63677 18.3452 7.11372C17.786 6.59067 17.0427 6.2992 16.2698 6.3H15.5079V5.4C15.5079 3.96783 14.9276 2.59432 13.8947 1.58162C12.8617 0.568927 11.4608 0 10 0ZM6.32806 5.4C6.32806 4.44522 6.71493 3.52955 7.40355 2.85442C8.09217 2.17928 9.02614 1.8 10 1.8C10.9739 1.8 11.9078 2.17928 12.5965 2.85442C13.2851 3.52955 13.6719 4.44522 13.6719 5.4V6.3H6.32806V5.4ZM17.4357 9.189L18.1609 24.003C18.1666 24.1578 18.1412 24.3122 18.0861 24.4573C18.031 24.6025 17.9472 24.7356 17.8396 24.849C17.7297 24.9596 17.5984 25.0477 17.4534 25.1079C17.3084 25.1682 17.1525 25.1995 16.995 25.2H3.00496C2.84745 25.1995 2.69163 25.1682 2.54661 25.1079C2.4016 25.0477 2.2703 24.9596 2.16041 24.849C2.0528 24.7356 1.96904 24.6025 1.91391 24.4573C1.85878 24.3122 1.83336 24.1578 1.83912 24.003L2.56433 9.189C2.57849 8.89531 2.70755 8.61827 2.92467 8.41546C3.14179 8.21265 3.43028 8.09967 3.73017 8.1H16.2698C16.5697 8.09967 16.8582 8.21265 17.0753 8.41546C17.2924 8.61827 17.4215 8.89531 17.4357 9.189Z"
							fill="black"
						/>
						<path d="M18 7.5H2L1.5 25.5H18.5L18 7.5Z" fill="black" />
					</svg>
				</div>
			</div>

			<div class="flex flex-col gap-10">
				<h4 class="mt-6 text-2xl">
					Welkom <strong>{$customer.first_name ? $customer.first_name : 'Padeller'}</strong>,
				</h4>
				<ul class="text-xl">
					{#each navigation as item}
						<li class="group">
							<a href={item.href} class="flex py-2" on:click={() => (menuIsOpen = false)}>
								{item.title}
							</a>
						</li>
					{/each}
				</ul>
				<a
					href="/padel-pack"
					class="button button-primary !font-normal shadow-xl !w-full !justify-center"
				>
					Ontdek het aanbod
				</a>
			</div>
		</div>
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<div class="absolute bg-black/80 inset-0 z-10 h-screen" on:click={() => (menuIsOpen = false)} />
	{/if}
</header>

{#if $cart.isOpen}
	<Cart />
{/if}

<style lang="postcss">
	.header {
		@apply py-6 fixed w-full z-50;
	}
	.header.scrolled {
		@apply bg-black;
	}
	.header.scrolled.theme-light,
	.theme-light {
		@apply !bg-white text-black;
	}
	.cart-label {
		@apply absolute -top-1 -right-2 w-4 h-4 flex text-xs font-bold items-center justify-center bg-primary rounded-full text-black shadow-sm;
	}

	.menu__navigation {
		@apply absolute inset-0 bottom-auto bg-white p-10 rounded-b-3xl text-black z-[51];
	}
	.menu__user {
		@apply absolute top-16 -right-8 bg-white min-w-[230px] text-black rounded-b-xl p-6 shadow-lg;
	}
	.link-active {
		@apply font-bold;
	}
</style>
