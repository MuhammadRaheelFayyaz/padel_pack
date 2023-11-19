<script>
	import { page } from '$app/stores';
	import { ArrowLeft, Icon } from 'svelte-hero-icons';
	import Image from '$lib/assets/404-padel.png';
</script>

<section class="section pt-40">
	<div class="container flex flex-col justify-center text-center">
		{#if $page.status === 404}
			<img src={Image} alt="404" class="w-full max-w-md" />
			
			<h1 class="mb-2">Er is iets mis gegaan</h1>
			<p>
				De pagina die je zoekt bestaat waarschijnlijk niet meer
			</p>
            
		{:else if $page.status === 500}
			<h1>Server error.</h1>
			<p>Er is een probleem opgetreden, ga terug of neem contact met ons op.</p>
		{:else}
			<h1>Er gaat iets fout. Ga terug of neem contact met ons op.</h1>
		{/if}
		<a href="/" class="button button-primary">
			Terug naar beginpagina
			<Icon src={ArrowLeft} class="w-6 h-6 ml-1" />
		</a>
	</div>
</section>
