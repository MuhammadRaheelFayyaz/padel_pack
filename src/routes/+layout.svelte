<script>
	import { getTheme } from '$lib/utilities/darkMode.js';
	import { page } from '$app/stores';
	import '$lib/app.css';
	import Header from '$lib/components/Header.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import Head from '$lib/components/Head.svelte';
	import Newsletter from '../lib/components/Newsletter.svelte';

	let theme;

	$: theme = getTheme($page.url.pathname);

</script>
    <Head />

    <div class="layout" class:dark-theme={theme === 'dark'}>
        <Header />

        <main>
            <slot />
        </main>

        <Footer />
    </div>

<style lang="scss">
	.layout {
		@apply bg-[#F5F5F5] text-theme-dark;

		&.dark-theme {
			@apply bg-theme-dark text-white;
		}
	}
</style>
