<script>
	import { useForm } from '@getneurotic/svelte/helpers';
	import Formfield from '$lib/components/Formfield.svelte';
	import customer from '$lib/stores/customer';
	import Modal from '../../../lib/components/Modal.svelte';

	export let subscriptionModal = false;
    const countries = [
        {
            label: "Nederland",
            value: "nederland"
        },
        {
            label: "België",
            value: "belgie"
        }
    ];

    const cancelSubscription = useForm({
        email: $customer.email ?? '',
        remember_token: localStorage.getItem('remember_token') || '',
    });

	let countryCode = '+31';	
    let showModalRemovePaymentMethod = false;
	
    // Profile Account Details
	const accountDetails = useForm({
		first_name: $customer.first_name || '',
		last_name: $customer.last_name || '',
		phone: $customer.phone || '',
        remember_token: localStorage.getItem('remember_token') || '',
	});

    // Profile Login Details
    const loginDetails = useForm({
        email: $customer.email || '',
		password: $customer.password || '',
		new_password: '',
		confirm_new_password: '',
        remember_token: localStorage.getItem('remember_token') || '',
	});

    // Profile Login Details
    const locationDetails = useForm({
        address: $customer.address || '',
		housenumber: $customer.housenumber || '',
        postal_code: $customer.postal_code || '',
        city: $customer.city || '',
        country: $customer.country ?? 'nederland',
        remember_token: localStorage.getItem('remember_token') || '',
	});

    // Receive emails
    const emailsPrefences = useForm({
        email: $customer.email,
        newsletter: $customer.newsletter,
		promotional: $customer.promotional,
        remember_token: localStorage.getItem('remember_token') || '',
	});
	
    async function handleAccountDetails() {
        if ($accountDetails.remember_token) {
            $accountDetails.post('/api/auth/account-details', {
                onSuccess: (props) => {}
            });

        } else {
            console.error("Remember token not found in local storage");
        }
    }
    
    async function handleLoginDetails() {
        if ($loginDetails.remember_token) {
            $loginDetails.post('/api/auth/login-details', {
                onSuccess: (props) => {}
            });

        } else {
            console.error("Remember token not found in local storage");
        }
    }

    async function handleLocationDetails() {
        if ($locationDetails.remember_token) {
            $locationDetails.post('/api/auth/location-details', {
                onSuccess: (props) => {}
            });

        } else {
            console.error("Remember token not found in local storage");
        }
    }

    async function handleEmailpreferences() {
        if ($emailsPrefences.remember_token) {
            $emailsPrefences.post('/api/auth/email-prefences-details', {
                onSuccess: (props) => {}
            });

        } else {
            console.error("Remember token not found in local storage");
        }
    }
	
	function updatePhoneNumberFormat(event) {		
		if (event.target.value === 'nederland') {
			countryCode = '+31';
		} else if (event.target.value === 'belgie') {
			countryCode = '+32';
		}
	}

    async function handleCancelSubscription() {
        $cancelSubscription.post(`/api/auth/cancel-subscription`, {
            onSuccess: (props) => {
                subscriptionModal = !subscriptionModal;
            }
        });
    }
</script>

{#if $cancelSubscription.successful}
    <div class="text-gray-500 p-4 mb-4">
        Abbonement is succesvol geannuleerd.
    </div>
{/if}

<div class="grid--masonry">
	<!-- User Details -->
	<div class="masonry-item">
		<div class="card">
			<div class="card__body">
				<h4 class="card__title">Persoonlijke gegevens</h4>
                {#if $accountDetails.successful}
                    <div>
                        <p>Updated</p>
                    </div>
                {/if}
				<form class="form--dark" on:submit|preventDefault={handleAccountDetails}>
					<div class="flex flex-col space-y-6">
						<Formfield
							id="firstName"
							label="Voornaam"
							required
							bind:error={$accountDetails.errors.first_name}
							bind:value={$accountDetails.first_name}
						/>
						<Formfield
							id="lastName"
							label="Achternaam"
							required
							bind:error={$accountDetails.errors.last_name}
							bind:value={$accountDetails.last_name}
						/>
						<div class="form-group">
							<label for="tel">Telefoon</label>
							<div class="flex items-center gap-6">
								<div class="relative">
									<select
										id="countryCode"
										class="w-32 appearance-none border-2 h-14 px-2 rounded-lg"
										on:change={updatePhoneNumberFormat}
									>
										<option value="nederland">🇳🇱 NL</option>
										<option value="beglie">🇧🇪 BE</option>
									</select>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										viewBox="0 0 20 20"
										fill="currentColor"
										class="w-7 h-7 absolute right-2 top-1/2 -translate-y-1/2"
									>
										<path
											fill-rule="evenodd"
											d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
											clip-rule="evenodd"
										/>
									</svg>
								</div>
                                <div class="flex items-center relative w-full">
                                    <div class="flex justify-center items-center input !w-6 !rounded-r-none">
                                        {countryCode}
                                    </div>
                                    <div class="bg-gray-200 w-full rounded-r-lg overflow-hidden">
                                        <Formfield
                                            id="phone"
                                            required
											class="!pl-0 bg-gray-200 h-14 !w-full !mr-0"
                                            bind:error={$accountDetails.errors.phone}
                                            bind:value={$accountDetails.phone}
                                        />
                                    </div>
                                </div>
							</div>
						</div>
					</div>
 
                    <div class="card__footer !justify-end mt-8 !pb-0">
                        <button class="button button-dark">Opslaan</button>
                    </div>
				</form>
			</div>
		</div>
	</div>

	<!-- Email -->
	<div class="masonry-item">
		<div class="card">
			<div class="card__body">
				<h4 class="card__title">Account e-mail</h4>

                {#if $loginDetails.successful}
                    <p>Updated</p>

                    {:else}
                    <form class="form--dark" on:submit|preventDefault={handleLoginDetails}>
                        <div class="flex flex-col space-y-6">
                            <Formfield
                                id="email"
                                label="E-mailadres"
                                required
                                bind:error={$loginDetails.errors.email}
                                bind:value={$customer.email}
                                disabled
                            />
                            <Formfield
                                type="password"
                                id="password"
                                label="Oud Wachtwoord"
                                required
                                bind:error={$loginDetails.errors.password}
                                bind:value={$loginDetails.password}
                            />
                            <Formfield
                                type="password"
                                id="new_password"
                                label="Nieuw Wachtwoord"
                                required
                                bind:error={$loginDetails.errors.new_password}
                                bind:value={$loginDetails.new_password}
                            />
                            <Formfield
                                type="password"
                                id="confirm_new_password"
                                label="Bevestig nieuw Wachtwoord"
                                required
                                bind:error={$loginDetails.errors.confirm_new_password}
                                bind:value={$loginDetails.confirm_new_password}
                            />
                        </div>
    
                        <div class="card__footer !justify-end mt-8 !pb-0">
                            <button class="button button-dark">Wachtwoord wijzigen</button>
                        </div>
                    </form>
                {/if}
			</div>
		</div>
	</div>

	<!-- Address -->
	<div class="masonry-item">
		<div class="card">
			<div class="card__body">
				<h4 class="card__title">Adres</h4>
                {#if $locationDetails.successful}
                    <p>Updated</p>

                    {:else}
                        <form class="form--dark" on:submit|preventDefault={handleLocationDetails}>
                            <div class="flex flex-col space-y-6">
                                <Formfield
                                    id="address"
                                    label="Adres"
                                    required
                                    bind:error={$locationDetails.errors.address}
                                    bind:value={$locationDetails.address}
                                />
                                <Formfield
                                    id="housenumber"
                                    label="Huisnummer"
                                    required
                                    bind:error={$locationDetails.errors.housenumber}
                                    bind:value={$locationDetails.housenumber}
                                />
                                <Formfield
                                    id="postal_code"
                                    label="Postcode"
                                    required
                                    bind:error={$locationDetails.errors.postal_code}
                                    bind:value={$locationDetails.postal_code}
                                />
                                <Formfield
                                    id="city"
                                    label="Stad"
                                    required
                                    bind:error={$locationDetails.errors.city}
                                    bind:value={$locationDetails.city}
                                />
                                <Formfield
                                    id="country"
                                    label="Land"
                                    type="select"
                                    required
                                    options={countries}
                                    bind:error={$locationDetails.errors.country}
                                    bind:value={$locationDetails.country}
                                />
                            </div>
                            <div class="card__footer !justify-end mt-8 !pb-0">
                                <button class="button button-dark">Opslaan</button>
                            </div>
                        </form>

                {/if}
            </div>
		</div>
	</div>
	<!-- Payment method -->
	<div class="masonry-item">
		<div class="card">
			<div class="card__body">
				<h4 class="card__title">Betalingsmethode</h4>

                <div class="h-32 flex justify-center items-center text-center opacity-40">
                    Je hebt nog<br> geen betaalmethode geselecteerd!
                </div>

				<!-- <div class="flex items-center justify-between gap-4">
					<span> Flexibel lidmaatschap (pakket naam) </span>
					<span> &euro; (pakketprijs) </span>
				</div>

				<div class="flex items-center justify-between gap-4 mt-2">
					<span> Laatste betaling </span>
					<span> (datum) </span>
				</div>

				<div class="mt-10">(icon)(betaalmethode) met rekening dat eindigt op (nummer)</div> -->
			</div>
			<div class="card__footer !justify-between">
                <button 
                    class="button button-dark"
                >
                    Betaalmethode wijzigen
                </button>
			</div>
		</div>
	</div>

	<!-- Email prefences -->
	<div class="masonry-item">
		<div class="card">
			<div class="card__body">
				<h4 class="card__title">E-mailmeldingen</h4>
				<form class="form--dark" on:submit|preventDefault={handleEmailpreferences}>
                    <div class="flex items-center flex-wrap justify-between gap-4">
                        <div class="flex flex-wrap gap-4">
                            <Formfield
                                type="toggle"
                                id="newsletter"
                                label="Nieuwsbrief"
                                bind:error={$emailsPrefences.errors.newsletter}
                                on:click={() => ($emailsPrefences.newsletter = !$emailsPrefences.newsletter)}
                                checked={$emailsPrefences.newsletter === true}
                            />
                        </div>
    
                        <div class="flex flex-wrap gap-4">
                            <Formfield
                                type="toggle"
                                id="promotional"
                                label="Promotionele emails"
                                bind:error={$emailsPrefences.errors.promotional}
                                on:click={() => ($emailsPrefences.promotional = !$emailsPrefences.promotional)}
                                checked={$emailsPrefences.promotional === true}
                            />
                        </div>
                    </div>
                    <div class="card__footer !justify-end mt-8 !pb-0 !pr-0">
                        <button class="button button-dark">Opslaan</button>
                    </div>
                </form>
			</div>
		</div>
	</div>
</div>

<!-- Status -->
{#if $customer.products}
    <div class="masonry-item mt-10">
        <div class="card">
            <div class="card__body !pb-4">
                <h4 class="card__title">Status</h4>
                <div class="mt-8">Je lidmaatschap is <span class="text-green-lemon">actief</span>'.</div>
            </div>
            <div
                class="border-t grid grid-cols-1 md:grid-cols-2 gap-12 !justify-between !font-normal py-5 px-6"
            >
                <div>
                    <p>
                        Jammer dat je gaat! Let op, bij vroegtijdige opzegging van de introductiedeal kunnen er
                        kosten in rekening worden gebracht. Zorg dat je dit begrijpt of controleer of dit voor jou
                        geldt voordat je doorgaat met het opzeggen van je lidmaatschap.
                    </p>
                    {#if $customer.products}
                        <button
                            class="button button-outline-primary"
                            data-sveltekit-noscroll
                            on:click={() => (subscriptionModal = !subscriptionModal)}
                        >
                            Lidmaatschap opzeggen
                        </button>

                        {:else}
                            <button
                                class="button button-outline-primary !opacity-20"
                                disabled
                            >
                                Lidmaatschap opzeggen
                            </button>
                    {/if}
                </div>
                <div>
                    <p>
                        Even pauzeren?<br />
                        Als je minder gaat spelen of andere plannen hebt, pauzeer je jouw bezorging eenvoudig in de
                        maand dat het niet uitkomt.
                    </p>
                    <a href="/account/dashboard" class="button button-dark">Een maand pauzeren</a>
                </div>
            </div>
        </div>
    </div>
{/if}

<!-- Extra feature -->
<!-- <div class="flex flex-col justify-center bg-[#16191B] p-8 gap-8 rounded-lg text-white mt-10">
	<div class="max-w-2xl">
		<div class="leading-7">
			<h5 class="font-bold text-xl mb-4">Deel & verdien!</h5>
			<p>
				Voor elke vriend die je aanmeldt en een box bestelt, <strong>krijg je 50% korting</strong>
				op je volgende box. Deel de liefde voor padel en profiteer samen van geweldige besparingen. Hoe
				meer vrienden je aanmeldt, hoe meer je bespaart. Begin nu met delen!
			</p>
		</div>
		<form class="mt-4 max-w-md">
			<div class="form-group">
				<input type="mail" placeholder="E-mailadres" class="input" />
			</div>
			<button class="button button-white !w-full mx-auto mt-10"> Nodig vriend(in) uit </button>
		</form>
	</div>
</div> -->

{#if subscriptionModal}
	<div>
		<div
			class="fixed top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 lg:left-40 lg:translate-x-0 z-[60] w-full max-w-[520px]"
		>
			<div
				class="relative flex flex-col bg-white rounded-xl border-2 border-theme-dark-blue/10 py-8 px-10 text-sm"
			>
				<button
					class="absolute top-2 right-2 flex items-center justify-center w-7 h-7 rounded-full border border-theme-dark-blue hover:bg-theme-dark-blue hover:text-white duration-200"
					on:click={() => (subscriptionModal = !subscriptionModal)}
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="currentColor"
						class="w-4 h-4"
					>
						<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
					</svg>
				</button>
				<h4 class="text-2xl mb-3">Weet je zeker dat je wilt opzeggen?</h4>
                {#if $customer.products[0].title}
                    <p>
                        Je staat op het punt om je <strong>{$customer.products[0].title}</strong> op te zeggen.
                    </p>
                {/if}
				<p>
					Door op te zeggen & daarmee welkomstactie niet af te maken, wordt de <strong
						>vergeven korting in rekening gebracht.</strong
					> Dit bedrag is afhankelijk van je pakket & wordt na je opzeggen gecommuniceerd.
				</p>
				<div class="flex flex-col lg:flex-row items-center flex-wrap gap-4">
					<button 
                        class="button button-dark !rounded-md !text-sm !px-4"
                    >
						Pauzeer komende maanden
					</button>
					<button 
                        class="button button-outline-primary !rounded-md !text-sm !px-4"
                        on:click={handleCancelSubscription}
                    >
						Toch opzeggen
					</button>
				</div>
			</div>
		</div>
		<div class="fixed inset-0 bg-black/40 w-full h-screen z-50" />
	</div>
{/if}

<Modal bind:isOpen={showModalRemovePaymentMethod}>
    <h4>Weet je zeker dat je deze betaalmethode wilt verwijderen?</h4>
    <div class="flex items-center gap-4 mt-8">
        <button class="button button-outline-primary" on:click={() => showModalRemovePaymentMethod = false}>Verwijderen</button>
        <button class="button button-dark" on:click={() => showModalRemovePaymentMethod = false}>Sluiten</button>
    </div>
</Modal>
