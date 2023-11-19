<script>
	import Login from '$lib/components/Login.svelte';
	import CreateAccount from '$lib/components/CreateAccount.svelte';
</script>

<!-- Login -->
<div class="py-32 pt-48">
	<div class="container">
		<div class="flex flex-col md:flex-row gap-20">
			<div class="w-full lg:w-1/2 lg:pr-28">
				<h2 class="text-2xl mb-4">Nieuwe klant</h2>
				<p>Is dit je eerste bestelling bij Padel Pack?<br /> Ga dan hier verder!</p>

				<CreateAccount />
			</div>

			<div class="w-full lg:w-1/2 lg:pl-28">
				<Login />
			</div>
		</div>
	</div>
</div>
