<script>
	import { page } from '$app/stores';
	import { onMount } from 'svelte';

	export let title = null;
	export let description = null;
	export let image = null;

	$: cp = $page.data.page?.properties || {};
    
	$: metaTitle = title ? `${title} | Padel Pack -  De oplossing voor jou!` : cp.meta_title || '';
	$: metaDescription = description || cp.meta_description || '';
	$: metaImage = `${image || cp.meta_image?.url || ''}?width=1200&height=630`;
	$: metaUrl = $page.url.pathname ?? '';

	onMount(() => {
		const url = new URL(window.location.href);
		const rememberToken = url.searchParams.get('remember_token');

		rememberToken && localStorage.setItem('remember_token', rememberToken);
	});
</script>

<svelte:head>
	<!-- Primary Meta Tags -->
	<title>{metaTitle}</title>
	<link rel="canonical" href={metaUrl} />
	<meta name="title" content={metaTitle} />
	<meta name="description" content={metaDescription} />

	<!-- Open Graph / Facebook -->
	<meta property="og:type" content="website" />
	<meta property="og:url" content={metaUrl} />
	<meta property="og:title" content={metaTitle} />
	<meta property="og:description" content={metaDescription} />
	<meta property="og:image" content={metaImage} />

	<!-- Twitter -->
	<meta property="twitter:card" content="summary_large_image" />
	<meta property="twitter:url" content={metaUrl} />
	<meta property="twitter:title" content={metaTitle} />
	<meta property="twitter:description" content={metaDescription} />
	<meta property="twitter:image" content={metaImage} />
</svelte:head>
