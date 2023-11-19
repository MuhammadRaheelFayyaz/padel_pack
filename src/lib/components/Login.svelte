<script>
	import { goto } from '$app/navigation';
	import { useForm } from '@getneurotic/svelte/helpers';
	import Formfield from './Formfield.svelte';
	import customer from '../../lib/stores/customer';
	import { onMount } from 'svelte';
	import { slide } from 'svelte/transition';

	let forgotPassword = false;

	const form = useForm({
		email: '',
		password: '',
		remember: true
	});

	const forgotPasswordForm = useForm({
		email: ''
	});

	async function handleSubmit() {
		$form.post('/api/auth/login', {
			onSuccess: (props) => {
				const { remember_token } = props.customer.properties;

				if (props.remember) {
					localStorage.setItem('remember_token', remember_token);
				} else {
					sessionStorage.setItem('remember_token', remember_token);
				}

				$customer.set(customer);

				handleRedirect();
			}
		});
	}

	async function handleForgotPassword() {
		$form.post('/api/auth/reset-password', {
			onSuccess: (props) => {
				forgotPassword = false;
			}
		});
	}

	function handleRedirect() {
		goto('/account');
	}

	onMount(() => {
		if ($customer.isAuthenticated) {
			handleRedirect();
		}
	});
</script>

{#if forgotPassword}
	<h1 class="mb-4 text-2xl">Wachtwoord vergeten</h1>
{:else}
	<h1 class="mb-4 text-2xl">Inloggen klant</h1>

	<div class="flex items-center gap-2">
		<!-- Facebook -->
		<a
			class="flex justify-center items-center w-14 h-14 rounded-md border-2 border-[#D9D9D9]"
			href="/api/auth/login/facebook"
			title="Log in met Facebook"
		>
			<svg
				width="12"
				height="24"
				viewBox="0 0 12 24"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path
					d="M9.89184 3.8055C8.39646 3.8055 7.97136 4.4655 7.97136 5.9205V8.322H11.9487L11.5568 12.2123H7.9706V24H3.21085V12.2115H0V8.32125H3.21236V5.98725C3.21236 2.0625 4.79367 0 9.22932 0C10.1813 0 11.3201 0.075 12 0.1695V3.822"
					fill="#3C5A99"
				/>
			</svg>
		</a>

		<!-- Google -->
		<a
			class="flex justify-center items-center w-14 h-14 rounded-md border-2 border-[#D9D9D9]"
			href="/api/auth/login/google"
			title="Log in met Google"
		>
			<svg
				width="24"
				height="24"
				viewBox="0 0 24 24"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
			>
				<g clip-path="url(#clip0_189_315)">
					<path
						d="M24 12.3924C24 11.4303 23.9166 10.7281 23.7361 10H12V14.3427H18.8888C18.75 15.422 18 17.0473 16.3333 18.1394L16.3099 18.2848L20.0207 20.976L20.2778 21C22.6388 18.9586 24 15.955 24 12.3924Z"
						fill="#4285F4"
					/>
					<path
						d="M11.9114 24C15.2093 24 17.9778 22.8919 20 20.9806L16.1457 17.9334C15.1143 18.6675 13.73 19.18 11.9114 19.18C8.68147 19.18 5.94007 17.0055 4.96283 14L4.81959 14.0124L1.04931 16.9903L1 17.1301C3.00855 21.2021 7.13427 24 11.9114 24Z"
						fill="#34A853"
					/>
					<path
						d="M5 14.9399C4.75516 14.1816 4.61346 13.3692 4.61346 12.5297C4.61346 11.6901 4.75516 10.8777 4.98712 10.1195L4.98063 9.95798L1.3557 7L1.2371 7.05928C0.45104 8.71124 0 10.5663 0 12.5297C0 14.4931 0.45104 16.348 1.2371 18L5 14.9399Z"
						fill="#FBBC05"
					/>
					<path
						d="M11.8649 4.81992C14.1487 4.81992 15.6892 5.83099 16.5676 6.67593L20 3.241C17.892 1.23269 15.1486 0 11.8649 0C7.1081 0 2.99998 2.79777 1 6.86976L4.93242 10C5.91899 6.99446 8.6487 4.81992 11.8649 4.81992Z"
						fill="#EB4335"
					/>
				</g>
				<defs>
					<clipPath id="clip0_189_315">
						<rect width="24" height="24" fill="white" />
					</clipPath>
				</defs>
			</svg>
		</a>
	</div>
{/if}

<div>
	{#if forgotPassword}
		<div transition:slide>
			<form
				class="form--dark mt-8"
				class:loading={$form.processing}
				on:submit|preventDefault={handleForgotPassword}
			>
				<div class="flex flex-col gap-4">
					<Formfield
						id="email"
						placeholder="E-mailadres"
						required
						bind:error={$form.errors.email}
						bind:value={$form.email}
					/>
				</div>
				<button class="button button-dark mt-8" class:loading={$form.processing}
					>Nieuw wachtwoord aanvragen</button
				>
			</form>

			<button class="mt-8" on:click={() => (forgotPassword = !forgotPassword)}>
				Terug naar inloggen
			</button>
		</div>
	{/if}
	{#if !forgotPassword}
		<div transition:slide>
			<form
				class="form--dark mt-8"
				class:loading={$form.processing}
				on:submit|preventDefault={handleSubmit}
			>
				<div class="flex flex-col gap-4">
					<Formfield
						id="email"
						placeholder="E-mailadres"
						required
						bind:error={$form.errors.email}
						bind:value={$form.email}
					/>

					<Formfield
						id="password"
						type="password"
						placeholder="Password"
						required
						bind:error={$form.errors.password}
						bind:value={$form.password}
					/>

					<Formfield
						id="remember"
						type="checkbox"
						label="Ingelogd blijven?"
						checked={$form.remember}
						on:click={() => ($form.remember = !$form.remember)}
					/>
				</div>

				<button class="button button-dark mt-8" class:loading={$form.processing}> Doorgaan </button>
			</form>
			<button class="mt-8" on:click={() => (forgotPassword = !forgotPassword)}>
				Wachtwoord vergeten?
			</button>
		</div>
	{/if}
</div>
