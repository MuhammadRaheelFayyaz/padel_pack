<script>
	import { page } from '$app/stores';
	import Authentication from '$lib/components/Authentication.svelte';
	import customer from '$lib/stores/customer';

	const tabs = [
		{ label: 'Dashboard', link: '/account/dashboard' },
		{ label: 'Gegevens', link: '/account/gegevens' },
		{ label: 'Bestellingen', link: '/account/bestellingen' }
	];
</script>

<Authentication>
	<div class="py-32">
		<div class="container">
			{#if $customer.first_name}
				<h5 class="title">
					{$customer.first_name}
					{$customer.last_name || ''}
				</h5>
			{/if}
			<div class="flex items-center justify-between overflow-auto">
				{#if tabs}
					<div class="flex items-center gap-4 lg:gap-8 text-sm">
						{#each tabs as tab}
							<a href={tab.link} class="tab" class:tab-active={$page.url.pathname === tab.link}>
								{tab.label}
							</a>
						{/each}
					</div>
				{/if}

				<button
					class="flex items-center gap-1 opacity-20 hover:opacity-60 duration-100 ml-6 md:ml-0"
					on:click={() => $customer.logout()}
				>
					Uitloggen
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 24 24"
						fill="currentColor"
						class="w-6 h-6"
					>
						<path
							fill-rule="evenodd"
							d="M7.5 3.75A1.5 1.5 0 006 5.25v13.5a1.5 1.5 0 001.5 1.5h6a1.5 1.5 0 001.5-1.5V15a.75.75 0 011.5 0v3.75a3 3 0 01-3 3h-6a3 3 0 01-3-3V5.25a3 3 0 013-3h6a3 3 0 013 3V9A.75.75 0 0115 9V5.25a1.5 1.5 0 00-1.5-1.5h-6zm10.72 4.72a.75.75 0 011.06 0l3 3a.75.75 0 010 1.06l-3 3a.75.75 0 11-1.06-1.06l1.72-1.72H9a.75.75 0 010-1.5h10.94l-1.72-1.72a.75.75 0 010-1.06z"
							clip-rule="evenodd"
						/>
					</svg>
				</button>
			</div>
		</div>

		<hr class="border-b-2 border-b-[#E9E9E9] mb-8 mt-4" />

		<div class="container">
			<slot />
		</div>
	</div>
</Authentication>

<style lang="postcss">
	.title {
		@apply text-2xl font-bold mb-6;
	}
	.tab {
		@apply py-2 px-4 first:pl-0;
	}
	.tab-active {
		@apply font-bold;
	}
</style>
