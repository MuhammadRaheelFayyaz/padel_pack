<script>
	import { useForm } from '@getneurotic/svelte/helpers';
	import Formfield from '$lib/components/Formfield.svelte';
    import { page } from '$app/stores';

    const { page: cp, blocks } = $page.data;

	const contact = blocks.find(block => block.title === 'contact')?.properties;

	const form = useForm({
		first_name: '',
		last_name: '',
		email: '',
		phone: '',
		message: '',
		agreement: false,
	});

	function handleSubmit() {
		$form.post('/api/contact');
	}
</script>

<section class="section !pt-40">
	<div class="container">
		<div class="flex flex-col justify-center max-w-xl mx-auto text-center">
			{#if contact.title}
				<header class="mb-2">
					<h1>{contact.title}</h1>
				</header>
			{/if}
			{#if contact.content}
				{@html contact.content}
			{/if}
			{#if contact.button_url}
				<a href={contact.button_url} class="button button-primary mx-auto mt-8">
					{contact.button_text}
				</a>
			{/if}
		</div>
	</div>
</section>

<section class="section">
	<div class="container max-w-4xl mx-auto">
		{#if contact.subtitle}
			<h3 class="text-2xl mb-5">{contact.subtitle}</h3>
		{/if}

		{#if $form.successful}
			<p>
				We hebben uw inzending succesvol ontvangen en zullen zo spoedig mogelijk contact met u opnemen.
			</p>

			{:else}

				<form
					class="grid grid-cols-1 md:grid-cols-2 md:grid-rows-8 gap-12"
					class:loading={$form.processing} 
                    on:submit|preventDefault={handleSubmit}
				>
					<div class="flex flex-col row-span-4 gap-4">
						<Formfield
							id="first_name"
							label="Voornaam"
							class="input"
							required
							bind:error={$form.errors.first_name}
							bind:value={$form.first_name}
						/>
						<Formfield
							id="last_name"
							label="Achternaam"
							class="input"
							required
							bind:error={$form.errors.last_name}
							bind:value={$form.last_name}
						/>
						<Formfield
							id="email"
							label="E-mailadres"
							class="input"
							type="email"
							required
							bind:error={$form.errors.email}
							bind:value={$form.email}
						/>
						<Formfield
							id="phone"
							label="Telefoonnummer"
							class="input"
							required
							bind:error={$form.errors.phone}
							bind:value={$form.phone}
						/>
					</div>
					<div class="flex flex-col form-group last:row-span-4">
						<label for="message">Bericht*</label>
						<textarea
							class="w-full h-full rounded-md bg-white/30"
							id="message"
							bind:value={$form.message}
							class:error={$form.errors.message}
						/>
		
						<!-- TODO:    <div id="agreement" class="flex items-center flex-row-reverse bg-white/30 py-3 px-6 w-fit rounded-md mt-4">
							<FormField
								id="agreement"
								label="Algemene voorwaarden"
								type="checkbox"
								class="hidden peer" 
								required
								bind:error={$form.errors.agreement}
								bind:value={$form.agreement}
							/>
							<div class="w-4 h-4 min-w-[16px] bg-white rounded-md border peer-checked:bg-primary peer-checked:border-primary mr-2"/>
						</div> -->
						<Formfield
							id="agreement"
							label="Algemene voorwaarden"
							type="checkbox"
							required
							bind:error={$form.errors.agreement}
							bind:value={$form.agreement}
						/>
		
						<button class="button button-primary mt-6" class:loading={$form.processing}>
							Verzenden
						</button>
					</div>
				</form>
		{/if}
	</div>
</section>
