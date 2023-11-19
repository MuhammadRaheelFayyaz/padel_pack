<script>
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import customer from '$lib/stores/customer';
	import axios from 'axios';
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import Logo from './Logo.svelte';

	let isMounted = false;
	let loading = true;

	$: isMounted && $page.url.pathname && authenticate();

	async function authenticate() {
		loading = true;

		try {
			const rememberToken = localStorage.getItem('remember_token') || sessionStorage.getItem('remember_token');
			if (!rememberToken) throw new Error();

			const response = await axios.get(`/api/auth?token=${rememberToken}`);
			$customer.set(response.data);
			loading = false;
		} catch {
			localStorage.removeItem('remember_token');
			sessionStorage.removeItem('remember_token');
			goto('/login');
		}
	}

	onMount(() => (isMounted = true));
</script>

{#if loading}
	<div class="loader" out:fade>
		<div class="logo">
			<Logo theme="light" />
		</div>
	</div>
{:else}
	<slot />
{/if}

<style lang="scss">
	.loader {
		@apply absolute z-[99] inset-0 h-screen bg-gray-100 flex items-center justify-center;

		.logo {
			@apply animate-ping;
		}
	}
</style>
