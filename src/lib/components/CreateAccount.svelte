<script>
	import { useForm } from "@getneurotic/svelte/helpers";
	import { onMount } from 'svelte';
	import Formfield from "./Formfield.svelte";

	let accountActivated = false;

	const form = useForm({
		email: '',
		password: '',
		password_confirmation: ''
	});

	function handleSubmit() {
		$form.post('/api/customers', {
			// onSuccess: props => console.log('Success:', props),
			// onError: error => console.log('Error:', error)
		});
	}

	onMount(async () => {
		const urlParams = new URLSearchParams(window.location.search);
		const email = urlParams.get('email');
		const activation_code = urlParams.get('activation_code');

		if (email && activation_code) {
			const response = await fetch(`/api/auth/activate?email=${email}&activation_code=${activation_code}`);
			const data = await response.json();

			accountActivated = response.status === 200;
			if (!accountActivated) console.error('Activation Error:', data);
		}
	});
</script>

{#if accountActivated}
	<div class="bg-green-200 text-green-700 p-4 rounded-lg">
		<p>Je account is succesvol geactiveerd, je kunt nu inloggen.</p>
	</div>
{:else if $form.successful}
	<div class="bg-green-200 text-green-700 p-4 rounded-lg">
		<p>Bedankt voor je aanmelding. Een bevestigingsmail is verzonden naar het opgegeven e-mailadres. Open de mail en volg de instructies om je account te activeren.</p>
	</div>
{:else}
        <form class="form--dark" class:loading={$form.processing} on:submit|preventDefault={handleSubmit}>
            <div class="flex flex-col gap-4">
                <div class="form-group">
                    <Formfield
                        id="email"
                        placeholder="E-mailadres"
                        type="email"
                        required
                        bind:error={$form.errors.email}
                        bind:value={$form.email}
                    />
                </div>
    
                <div class="form-group">
                    <Formfield
                        id="password"
                        placeholder="Wachtwoord"
                        type="password"
                        required
                        bind:error={$form.errors.password}
                        bind:value={$form.password}
                    />
                </div>
    
                <div class="form-group">
                    <Formfield
                        id="password_confirmation"
                        placeholder="Bevestig Wachtwoord"
                        type="password"
                        required
                        bind:error={$form.errors.password_confirmation}
                        bind:value={$form.password_confirmation}
                    />
                </div>
            </div>
    
            <button type="submit" class="button button-dark mt-8" class:loading={$form.processing}>
                Doorgaan
            </button>
        </form>
{/if}
