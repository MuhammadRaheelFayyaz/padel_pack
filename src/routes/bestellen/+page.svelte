<script>
    import { slide } from "svelte/transition";
    import { useForm } from "@getneurotic/svelte/helpers";
	import { goto } from '$app/navigation';
    import Formfield from '$lib/components/Formfield.svelte';
	import customer from "$lib/stores/customer";
    import {client} from '$lib/utilities/multisafepayService'
    import cart from '$lib/stores/cart';

    let deliveryAddress = false;
    let newsletter = false;

    let countryCode = 'nederland';
    let phoneNumberStore = '+31';

    const form = useForm({
        // Customer
        customer_id: $customer.id ?? '',
        first_name: $customer.first_name ?? '',
        last_name: $customer.last_name ?? '',
        postal_code: $customer.postal_code ?? '',
        housenumber: $customer.housenumber ?? '',
        address: $customer.address ?? '',
        city: $customer.city ?? '',
        country: $customer.country ?? '',
        phone: $customer.phone ?? '',
        email: $customer.email ?? '',

        // General agreement
        agreement: $customer.agreement ?? false,

        // Newsletter
        newsletter: newsletter ?? '',

        // Delivery
        deliveryAddress: false,
        delivery_first_name: '',
        delivery_last_name: '',
        delivery_postal_code: '',
        delivery_housenumber: '',
        delivery_address: '',
        delivery_city: '',
        delivery_country: '',
        delivery_phone: '',

        products: JSON.stringify($cart.items),
    });

    async function handleSubmit() {
        $form.post(`/api/orders`, {
            onSuccess: async (props) => {

              try{
                let orderData = props.data
                let customer = orderData
                const {customerId}=customer
                // const {product}=orderData.products[0]
                const productId=$cart.items[0].product.id
                const orderId = `${customerId}-${productId}`;
                const amount=Math.ceil($cart.items[0].totalPrice * 100)
                const productDescription = $cart.items[0].product.properties.info.join(', ')

                const orderResponse = await client.orders.create({
                  "type":"redirect",
                  "gateway":"iDEAL",
                  "order_id":orderId,
                  "currency":"EUR",
                  "amount":amount,
                  "description":productDescription,
                  "payment_options": {
                    "notification_method": "POST",
                    "notification_url": "https://c546-182-180-59-151.ngrok-free.app/api/webhooks/multisafepay",
                    "redirect_url": "https://c546-182-180-59-151.ngrok-free.app/bestellen",
                    "cancel_url": "https://c546-182-180-59-151.ngrok-free.app/cancel"
                  },
                  "recurring_model":"unscheduled",
                  "customer":{
                    "reference":customerId,
                    ...customer
                  }
                })

                window.location.href=orderResponse.data.payment_url
                return orderResponse
              }catch(error){
                console.log('Error creating redirect order:', error);
                // throw error;
              }

			}
        });
    }

    function handleRedirect() {
        // If customer have payment method
        // goto('/bestellen/bedankt');

        // If customer DONT have payment method
		goto('https://www.multisafepay.com');
	}


    function handleCountryChange(event) {
        countryCode = event.target.value;
        updatePhoneNumberFormat(countryCode);
    }

    function updatePhoneNumberFormat(countryCode) {
        if (countryCode === 'nederland') {
            phoneNumberStore = '+31'
        }
        if (countryCode === 'belgie') {
            phoneNumberStore = '+32'
        }
    }

    let countryOptions = [
        { value: 'nederland', label: 'Nederland' },
        { value: 'belgie', label: 'Belgie' }
    ];

    let countryCodeOptions = [
        { value: 'nederland', label: '🇳🇱 NL' },
        { value: 'belgie', label: '🇧🇪 BE' }
    ];

    const handleDeliveryAddress = (event) => {
        event.preventDefault();

        deliveryAddress = !deliveryAddress
        $form.deliveryAddress = true;
    }
</script>

<section class="pt-32 pb-12 lg:pb-20 lg:pt-40">
    <div class="container">
        <!-- Steps -->
        <div class="grid grid-cols-1 mb-8">
            <div class="relative flex justify-between gap-4">
                <div class="flex justify-center items-center border border-theme-dark-blue w-8 h-8 rounded-full bg-theme-dark-blue z-[1]">
                    <svg width="8" height="11" viewBox="0 0 8 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M4 0C3.41569 0 2.8553 0.231785 2.44213 0.644365C2.02896 1.05695 1.79684 1.61652 1.79684 2.2V2.56667H1.49207C1.18293 2.56634 0.885583 2.68509 0.661922 2.89818C0.438261 3.11128 0.305524 3.4023 0.291343 3.71067L0.00126026 9.74233C-0.00617595 9.90453 0.0193541 10.0665 0.0763114 10.2186C0.133269 10.3707 0.220474 10.5097 0.33267 10.6272C0.444867 10.7447 0.579731 10.8383 0.729135 10.9024C0.878538 10.9665 1.03939 10.9997 1.20198 11H6.79802C6.96061 10.9997 7.12146 10.9665 7.27087 10.9024C7.42027 10.8383 7.55513 10.7447 7.66733 10.6272C7.77953 10.5097 7.86673 10.3707 7.92369 10.2186C7.98065 10.0665 8.00618 9.90453 7.99874 9.74233L7.70866 3.71067C7.69448 3.4023 7.56174 3.11128 7.33808 2.89818C7.11442 2.68509 6.81707 2.56634 6.50793 2.56667H6.20316V2.2C6.20316 1.61652 5.97104 1.05695 5.55787 0.644365C5.1447 0.231785 4.58432 0 4 0ZM2.53123 2.2C2.53123 1.81102 2.68597 1.43796 2.96142 1.16291C3.23687 0.887857 3.61046 0.733333 4 0.733333C4.38954 0.733333 4.76313 0.887857 5.03858 1.16291C5.31403 1.43796 5.46878 1.81102 5.46878 2.2V2.56667H2.53123V2.2ZM6.97427 3.74367L7.26435 9.779C7.26665 9.84206 7.25649 9.90496 7.23444 9.9641C7.21239 10.0232 7.17888 10.0775 7.13584 10.1237C7.09188 10.1687 7.03936 10.2046 6.98136 10.2292C6.92335 10.2537 6.86102 10.2665 6.79802 10.2667H1.20198C1.13898 10.2665 1.07665 10.2537 1.01865 10.2292C0.960639 10.2046 0.908121 10.1687 0.864166 10.1237C0.82112 10.0775 0.787614 10.0232 0.765563 9.9641C0.743511 9.90496 0.733346 9.84206 0.735648 9.779L1.02573 3.74367C1.0314 3.62402 1.08302 3.51115 1.16987 3.42852C1.25672 3.3459 1.37211 3.29987 1.49207 3.3H6.50793C6.62789 3.29987 6.74328 3.3459 6.83013 3.42852C6.91698 3.51115 6.9686 3.62402 6.97427 3.74367Z" fill="#F7F72C"/>
                        <path d="M7.2001 3.05566H0.800098L0.600098 10.389H7.4001L7.2001 3.05566Z" fill="#F7F72C"/>
                    </svg>
                </div>
                <div class="flex justify-center items-center border border-theme-dark-blue w-8 h-8 rounded-full bg-[#F5F5F5] z-[1]">
                    <svg width="10" height="11" viewBox="0 0 10 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M4.99989 5.07692C5.69734 5.07692 6.30128 4.82677 6.79474 4.33321C7.2882 3.83974 7.53835 3.23594 7.53835 2.53838C7.53835 1.84107 7.2882 1.23719 6.79466 0.743551C6.30112 0.250155 5.69726 0 4.99989 0C4.30235 0 3.69857 0.250155 3.20511 0.743631C2.71165 1.23711 2.46143 1.84099 2.46143 2.53838C2.46143 3.23594 2.71165 3.83982 3.20519 4.33329C3.69873 4.82669 4.30259 5.07692 4.99989 5.07692Z" fill="#012242"/>
                        <path d="M9.21008 8.35294C9.19638 8.12968 9.16868 7.88615 9.1279 7.62898C9.08674 7.36989 9.03373 7.12496 8.97028 6.9011C8.90475 6.66972 8.81561 6.44122 8.70542 6.22225C8.59106 5.99498 8.45673 5.79708 8.306 5.63423C8.14838 5.46386 7.9554 5.32689 7.73224 5.22697C7.50986 5.12759 7.26341 5.07724 6.99979 5.07724C6.89626 5.07724 6.79613 5.12523 6.60276 5.26745C6.48376 5.35512 6.34456 5.45652 6.18918 5.56867C6.05632 5.6643 5.87634 5.7539 5.65404 5.83502C5.43715 5.9143 5.21693 5.95451 4.99958 5.95451C4.78223 5.95451 4.56209 5.9143 4.34497 5.83502C4.12289 5.75398 3.94291 5.66439 3.81021 5.56876C3.65631 5.45766 3.51703 5.35626 3.39624 5.26736C3.20311 5.12514 3.1029 5.07715 2.99937 5.07715C2.73567 5.07715 2.4893 5.12759 2.26699 5.22706C2.04399 5.3268 1.85094 5.46377 1.69316 5.63432C1.54251 5.79725 1.4081 5.99507 1.29389 6.22225C1.18379 6.44122 1.09465 6.66963 1.02903 6.90119C0.965659 7.12505 0.912656 7.36989 0.871491 7.62898C0.830713 7.8858 0.803012 8.12942 0.789316 8.3532C0.775852 8.57243 0.769043 8.79996 0.769043 9.02977C0.769043 9.62785 0.937339 10.112 1.26921 10.4691C1.59698 10.8215 2.03068 11.0002 2.55809 11.0002H7.44154C7.96894 11.0002 8.40249 10.8216 8.73034 10.4691C9.06229 10.1123 9.23058 9.62802 9.23058 9.02968C9.2305 8.79883 9.22362 8.57112 9.21008 8.35294Z" fill="#012242"/>
                    </svg>
                </div>
                <div class="flex justify-center items-center border border-theme-dark-blue w-8 h-8 rounded-full bg-[#F5F5F5] z-[1]">
                    <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M11.9547 1.88636V1.27272C11.9547 0.569817 11.3849 0 10.682 0H1.59108C0.888176 0 0.318359 0.569817 0.318359 1.27272V1.88636C0.318359 1.94911 0.369246 1.99999 0.431995 1.99999H11.8411C11.9038 1.99999 11.9547 1.94911 11.9547 1.88636Z" fill="#012242"/>
                        <path d="M0.318359 2.84093V6.72728C0.318359 7.43019 0.888176 8.00001 1.59108 8.00001H10.682C11.3849 8.00001 11.9547 7.43019 11.9547 6.72728V2.84093C11.9547 2.77818 11.9038 2.72729 11.8411 2.72729H0.431995C0.369246 2.72729 0.318359 2.77818 0.318359 2.84093ZM3.22744 5.8182C3.22744 6.01901 3.06462 6.18183 2.86381 6.18183H2.50017C2.29935 6.18183 2.13654 6.01901 2.13654 5.8182V5.45456C2.13654 5.25374 2.29935 5.09092 2.50017 5.09092H2.86381C3.06462 5.09092 3.22744 5.25374 3.22744 5.45456V5.8182Z" fill="#012242"/>
                    </svg>
                </div>
                <div class="flex justify-center items-center border border-theme-dark-blue w-8 h-8 rounded-full bg-[#F5F5F5] z-[1]">
                    <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M11.7251 0.231509C11.6457 0.158151 11.5513 0.099926 11.4473 0.0601915C11.3432 0.0204571 11.2316 0 11.1189 0C11.0062 0 10.8946 0.0204571 10.7905 0.0601915C10.6865 0.099926 10.592 0.158151 10.5126 0.231509L4.15139 6.07013L1.47882 3.61259C1.3964 3.53961 1.29911 3.48223 1.1925 3.44372C1.08589 3.40521 0.972054 3.38633 0.857483 3.38814C0.742911 3.38996 0.629852 3.41244 0.524761 3.45431C0.419669 3.49618 0.324603 3.55661 0.244991 3.63215C0.165378 3.7077 0.102779 3.79687 0.0607656 3.89459C0.0187524 3.99231 -0.00185163 4.09666 0.000130571 4.20167C0.00211277 4.30669 0.0266423 4.41032 0.0723181 4.50665C0.117994 4.60298 0.183922 4.69012 0.266338 4.76309L3.54515 7.76849C3.62453 7.84185 3.71897 7.90007 3.82302 7.93981C3.92707 7.97954 4.03867 8 4.15139 8C4.26411 8 4.37572 7.97954 4.47977 7.93981C4.58382 7.90007 4.67826 7.84185 4.75763 7.76849L11.7251 1.38201C11.8118 1.30872 11.881 1.21977 11.9283 1.12077C11.9756 1.02176 12 0.914848 12 0.806761C12 0.698675 11.9756 0.59176 11.9283 0.492754C11.881 0.393749 11.8118 0.304798 11.7251 0.231509Z" fill="#012242"/>
                    </svg>
                </div>
                <div class="absolute top-1/2 -translate-y-1/2 left-0 right-2/3 h-1 bg-theme-dark-blue"></div>
                <div class="absolute top-1/2 -translate-y-1/2 left-0 right-0 w-full h-1 bg-theme-dark-blue/20"></div>
            </div>
        </div>

        {#if $cart.items.length}
            <div class="flex flex-col lg:flex-row gap-14">
                <div class="space-y-8">
                    <h1 class="mb-8">Persoonlijke gegevens</h1>

                    <form
                        class="form--dark mt-8"
                    >
                        <div class="flex flex-col gap-4">

                            <Formfield
                                id="email"
                                label="E-mailadres*"
                                type="email"
                                required
                                bind:error={$form.errors.email}
                                bind:value={$form.email}
                                disabled
                            />
                        </div>
                    </form>

                    <hr class="border-1 border-black/10 mt-14 mb-14">

                    <div>
                        <form
                            class="form--dark mt-8"
                            on:submit|preventDefault={handleSubmit}
                        >
                            <div class="flex flex-col gap-4">
                                <Formfield
                                    id="first_name"
                                    label="Voornaam*"
                                    type="text"
                                    required
                                    bind:error={$form.errors.first_name}
                                    bind:value={$form.first_name}
                                />
                                <Formfield
                                    id="last_name"
                                    label="Achternaam*"
                                    type="text"
                                    required
                                    bind:error={$form.errors.last_name}
                                    bind:value={$form.last_name}
                                />
                                <div class="flex flex-col sm:flex-row gap-2">
                                    <Formfield
                                        id="postal_code"
                                        label="Postcode*"
                                        type="text"
                                        required
                                        bind:error={$form.errors.postal_code}
                                        bind:value={$form.postal_code}
                                    />
                                    <Formfield
                                        id="housenumber"
                                        label="Huisnummer*"
                                        type="text"
                                        required
                                        bind:error={$form.errors.housenumber}
                                        bind:value={$form.housenumber}
                                    />
                                </div>
                                <Formfield
                                    id="address"
                                    label="Adres*"
                                    type="text"
                                    required
                                    bind:error={$form.errors.address}
                                    bind:value={$form.address}
                                />
                                <Formfield
                                    id="city"
                                    label="Woonplaats*"
                                    type="text"
                                    required
                                    bind:error={$form.errors.city}
                                    bind:value={$form.city}
                                />

                                <Formfield
                                    id="country"
                                    label="Land*"
                                    type="select"
                                    required
                                    options={countryOptions}
                                    bind:error={$form.errors.country}
                                    bind:value={$form.country}
                                    on:change={handleCountryChange}
                                />

                                <div class="form-group">
                                    <label for="tel" class="mb-0">Telefoon*</label>
                                    <div class="flex items-center gap-6">
                                        <div class="relative">
                                            <select id="countryCode" class="w-32 appearance-none border-2 h-14 px-2 rounded-lg" bind:value={countryCode} on:change={handleCountryChange}>
                                                {#each countryCodeOptions as countryOption}
                                                    <option value={countryOption.value}>{countryOption.label}</option>
                                                {/each}
                                            </select>
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-7 h-7 absolute right-2 top-1/2 -translate-y-1/2">
                                                <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clip-rule="evenodd" />
                                            </svg>
                                        </div>

                                        <Formfield
                                            id="phone"
                                            placeholder={phoneNumberStore}
                                            type="text"
                                            required
                                            bind:error={$form.errors.phone}
                                            bind:value={$form.phone}
                                        />
                                    </div>
                                </div>
                            </div>

                            <!-- Delivery Address -->
                            <button
                                class="button button-link hover:bg-transparent items-center my-8"
                                on:click={(event) => handleDeliveryAddress(event)}
                            >
                                {#if deliveryAddress}
                                    <svg aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" class="w-5 h-5 mr-2 rotate-90" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M8.25 4.5l7.5 7.5-7.5 7.5" stroke-linecap="round" stroke-linejoin="round"></path>
                                    </svg>
                                    {:else}
                                        <svg aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" class="w-5 h-5 mr-2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M8.25 4.5l7.5 7.5-7.5 7.5" stroke-linecap="round" stroke-linejoin="round"></path>
                                        </svg>
                                {/if}
                                Ander Bezorgadres
                            </button>

                            {#if deliveryAddress}
                                <div
                                    class="flex flex-col space-y-4 form--dark mb-8"
                                    transition:slide="{{duration: 400}}"
                                >
                                    <div class="flex flex-col space-y-4 form--dark">
                                        <Formfield
                                            id="delivery_first_name"
                                            label="Voornaam*"
                                            type="text"
                                            required
                                            bind:error={$form.errors.delivery_first_name}
                                            bind:value={$form.delivery_first_name}
                                        />
                                        <Formfield
                                            id="delivery_last_name"
                                            label="Achternaam*"
                                            type="text"
                                            required
                                            bind:error={$form.errors.delivery_last_name}
                                            bind:value={$form.delivery_last_name}
                                        />
                                        <div class="flex flex-col sm:flex-row gap-2">
                                            <Formfield
                                                id="delivery_postal_code"
                                                label="Postcode*"
                                                type="text"
                                                required
                                                bind:error={$form.errors.delivery_postal_code}
                                                bind:value={$form.delivery_postal_code}
                                            />
                                            <Formfield
                                                id="delivery_housenumber"
                                                label="Huisnummer*"
                                                type="text"
                                                required
                                                bind:error={$form.errors.delivery_housenumber}
                                                bind:value={$form.delivery_housenumber}
                                            />
                                        </div>
                                        <Formfield
                                            id="delivery_address"
                                            label="Adres*"
                                            type="text"
                                            required
                                            bind:error={$form.errors.delivery_address}
                                            bind:value={$form.delivery_address}
                                        />
                                        <Formfield
                                            id="delivery_city"
                                            label="Woonplaats*"
                                            type="text"
                                            required
                                            bind:error={$form.errors.delivery_city}
                                            bind:value={$form.delivery_city}
                                        />

                                        <Formfield
                                            id="delivery_country"
                                            label="Land*"
                                            type="select"
                                            required
                                            options={countryOptions}
                                            bind:error={$form.errors.delivery_country}
                                            bind:value={$form.delivery_country}
                                            on:change={handleCountryChange}
                                        />

                                        <Formfield
                                            id="delivery_phone"
                                            placeholder={phoneNumberStore}
                                            type="text"
                                            required
                                            bind:error={$form.errors.delivery_phone}
                                            bind:value={$form.delivery_phone}
                                        />
                                    </div>
                                </div>
                            {/if}

                            <hr class="flex border-2 border-[#E9E9E9] mb-8">

                            <div class="flex flex-col space-y-6 form--dark">

                                <Formfield
                                    id="agreement"
                                    type="checkbox"
                                    label="Ik ga akkoord met de <a href='/gebruiksvoorwaarden' class='underline'><strong>Gebruiksvoorwaarden</strong><a>"
                                    required
                                    bind:error={$form.errors.agreement}
                                    bind:value={$form.agreement}
                                />

                                <Formfield
                                    id="newsletter"
                                    type="checkbox"
                                    label="Ik wil me aanmelden voor de nieuwsbrief van Padel Pack"
                                    on:checked={newsletter = true}
                                />

                                <button class="button button-success ml-auto" class:loading={$form.processing}>
<!--                                    Bestellen en betalen-->
                                    Ordering and paying
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                <!-- sidebar -->
                <aside class="flex flex-col gap-4">
                    <div class="card--simple">
                        <div class="card--simple__header">
                            <h5>Besteloverzicht <span class="text-xs">({$cart.items.length}) artikel</span></h5>
                        </div>
                        <div class="card--simple__body">
                            <h5>Vandaag verzonden</h5>

                            {#each $cart.items as item (item.product.id)}
                            <table>
                                <tr>
                                    <td class="pb-0">
                                        <strong>{item.product.title}</strong>
                                    </td>
                                    <table class="text-xs">
                                            {#if item.discountPrice}
                                                <tr class="text-right">
                                                    <td class="text-right w-6 pr-0 text-[#C8C8C8]">
                                                        <div class="relative">
                                                            &euro; {item.price.toFixed(2)}

                                                            <span class="absolute top-2 left-0 w-14 h-px bg-black/30 -rotate-12"></span>
                                                        </div>
                                                    </td>
                                                    {#if item.hasDiscount}
                                                        <td class="text-right w-6 pl-0 font-bold">
                                                            &euro; {item.discountPrice.toFixed(2)}
                                                        </td>
                                                    {/if}
                                                </tr>
                                                {:else}
                                                    <tr class="text-right">
                                                        <td>
                                                            &euro; {item.price.toFixed(2)}
                                                        </td>
                                                    </tr>
                                            {/if}
                                        </table>
                                </tr>
                                {#if item.hasDiscount}
                                        <tr>
                                            <td class="text-[10px] max-w-[181px] italic">
                                                <p class="whitespace-wrap"><strong class="text-green-lemon">Introductie deal:</strong> 50% korting 1e <br>pakket, normaal tarief pakket 2 en 3</p>
                                            </td>
                                            <td></td>
                                        </tr>
                                    {/if}
                            </table>

                            {#if item.hasDiscount}
                                    <div class="flex flex-col py-3 space-y-1">
                                        <h5>Normaal tarief pakket 2 & 3</h5>
                                        <table class="text-xs">
                                            <tr>
                                                <td class="w-6 pr-0">
                                                    <strong>{item.product.title} 2 & 3</strong>
                                                    <p class="text-green-lemon max-w-[70%]">Bepaal zelf welke maanden je deze<br/> pakketten bezorgd krijgt!</p>
                                                </td>

                                                <td class="text-right w-6 pl-0 font-bold">
                                                    (&euro; {item.price.toFixed(2)})
                                                </td>
                                            </tr>
                                        </table>
                                    </div>
                                {/if}

                                <hr class="border border-[#E9E9E9] my-3" />

                                    <table class="w-full">
                                    <tr>
                                        <td class="font-bold">Verzending</td>
                                        <td class="text-green-lemon font-bold text-right">Gratis</td>
                                    </tr>
                                    <tr>
                                        <td class="font-bold">
                                            Totaal
                                        </td>
                                        <td class="font-bold text-right">
                                            &euro; {item.totalPrice.toFixed(2)}
                                        </td>
                                    </tr>
                                </table>
                            {/each}
                        </div>
                    </div>
                    <div class="card--simple">
                        <div class="card--simple__header">
                            <h5>Verzending</h5>
                        </div>
                        <div class="card--simple__body text-[#C8C8C8]">
                            <div class="font-bold text-theme-dark-blue mb-2">
                                Standaard verzending
                            </div>
                            <p class="text-xs">Levering naar Nederland/België binnen 5 werkdagen</p>
                        </div>
                    </div>
                    <div class="card--simple">
                        <div class="card--simple__header">
                            <h5>Betaal veilig met</h5>
                        </div>
                        <div class="card--simple__body text-[#C8C8C8]">
                            <div class="flex flex-wrap gap-8">
                                <svg class="w-full h-auto pr-10" viewBox="0 0 243 41" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M3.37256 3.41663V37.5833H21.5724C33.5781 37.5833 38.7843 30.2246 38.7843 20.4665C38.7843 10.7464 33.5781 3.41663 21.5724 3.41663H3.37256Z" fill="white"/>
                                    <path d="M5.05859 5.97925H21.5831C32.7988 5.97925 37.0978 12.3858 37.0978 20.4676C37.0978 30.1584 31.0945 35.0209 21.5831 35.0209H5.05859V5.97925ZM6.66055 7.65492V33.3463H21.5831C30.5925 33.3463 35.4944 28.955 35.4944 20.4676C35.4944 11.745 30.1806 7.6544 21.5831 7.6544H6.66055V7.65492Z" fill="black"/>
                                    <path d="M9.27441 22.2083H13.4901V31.6041H9.27441V22.2083Z" fill="black"/>
                                    <path d="M11.3821 21.3541C13.0119 21.3541 14.3331 19.8244 14.3331 17.9374C14.3331 16.0504 13.0119 14.5208 11.3821 14.5208C9.75235 14.5208 8.43115 16.0504 8.43115 17.9374C8.43115 19.8244 9.75235 21.3541 11.3821 21.3541Z" fill="black"/>
                                    <path d="M23.6591 19.2873V20.7746H20.2435V14.8064H23.55V16.2932H21.6245V16.9842H23.4453V18.4715H21.6245V19.2879L23.6591 19.2873ZM24.2567 20.7757L25.9281 14.8043H27.8929L29.5638 20.7757H28.1263L27.8128 19.6207H26.0062L25.6922 20.7757H24.2567ZM26.4112 18.135H27.4108L26.9523 16.4482H26.8687L26.4112 18.135ZM30.2582 14.8048H31.6402V19.2879H33.6856C33.1244 11.1535 27.1818 9.39587 21.7788 9.39587H16.0205V14.808H16.8727C18.4266 14.808 19.3914 15.9424 19.3914 17.7678C19.3914 19.6514 18.4497 20.7757 16.8727 20.7757H16.0205V31.6042H21.7793C30.5595 31.6042 33.6173 27.2138 33.7254 20.7746H30.2582V14.8048ZM16.0195 16.2948V19.2879H16.8727C17.4639 19.2879 18.0104 19.1038 18.0104 17.7673C18.0104 16.462 17.4025 16.2948 16.8727 16.2948H16.0195Z" fill="#D50072"/>
                                    <g clip-path="url(#clip0_159_515)">
                                    <path d="M103.212 36.5797V36.6594H103.286C103.3 36.6596 103.314 36.6561 103.326 36.6492C103.331 36.6458 103.335 36.6412 103.338 36.6359C103.341 36.6306 103.342 36.6247 103.341 36.6187C103.342 36.6129 103.34 36.6071 103.338 36.6019C103.335 36.5967 103.331 36.5923 103.326 36.589C103.314 36.5818 103.301 36.5783 103.286 36.5789H103.212V36.5797ZM103.287 36.5233C103.319 36.5213 103.351 36.5305 103.377 36.5492C103.387 36.5577 103.396 36.5685 103.401 36.5807C103.406 36.593 103.409 36.6063 103.408 36.6197C103.409 36.6312 103.407 36.6427 103.402 36.6534C103.398 36.6641 103.391 36.6737 103.383 36.6817C103.363 36.699 103.338 36.7094 103.311 36.7114L103.411 36.8249H103.334L103.242 36.7122H103.213V36.8249H103.148V36.5235H103.288L103.287 36.5233ZM103.267 36.9289C103.301 36.9292 103.335 36.9225 103.365 36.909C103.395 36.8962 103.422 36.8779 103.445 36.855C103.469 36.8322 103.487 36.8051 103.5 36.7753C103.526 36.7122 103.526 36.6412 103.5 36.5781C103.487 36.5484 103.468 36.5214 103.445 36.4984C103.422 36.4755 103.395 36.4572 103.365 36.4444C103.334 36.4317 103.301 36.4253 103.267 36.4257C103.233 36.4254 103.199 36.4317 103.167 36.4444C103.137 36.457 103.109 36.4753 103.085 36.4984C103.05 36.5345 103.026 36.5803 103.017 36.6299C103.007 36.6795 103.013 36.7307 103.032 36.7773C103.044 36.8072 103.062 36.8343 103.085 36.857C103.109 36.8801 103.137 36.8984 103.167 36.911C103.199 36.9244 103.233 36.9312 103.267 36.9309M103.267 36.3532C103.355 36.3531 103.44 36.3874 103.502 36.4488C103.533 36.4783 103.557 36.5134 103.573 36.5522C103.59 36.592 103.599 36.6349 103.599 36.6782C103.599 36.7215 103.59 36.7644 103.573 36.8042C103.556 36.8428 103.532 36.8779 103.502 36.9076C103.472 36.9369 103.436 36.9605 103.397 36.9773C103.356 36.9947 103.312 37.0035 103.267 37.0032C103.222 37.0036 103.178 36.9948 103.136 36.9773C103.097 36.9609 103.061 36.9373 103.03 36.9076C103 36.8768 102.976 36.8405 102.96 36.8008C102.943 36.761 102.934 36.7181 102.934 36.6748C102.934 36.6315 102.943 36.5886 102.96 36.5488C102.977 36.51 103.001 36.4749 103.031 36.4454C103.061 36.4152 103.097 36.3915 103.137 36.3757C103.179 36.3583 103.223 36.3494 103.268 36.3498M72.6433 35.1891C72.6433 34.6143 73.0213 34.1421 73.6391 34.1421C74.2295 34.1421 74.6279 34.594 74.6279 35.1891C74.6279 35.7842 74.2295 36.236 73.6391 36.236C73.0213 36.236 72.6433 35.7638 72.6433 35.1891ZM75.3009 35.1891V33.5534H74.5871V33.9519C74.3607 33.6574 74.0173 33.4727 73.5503 33.4727C72.6303 33.4727 71.9083 34.1915 71.9083 35.1899C71.9083 36.1882 72.6299 36.907 73.5503 36.907C74.0171 36.907 74.3607 36.7221 74.5871 36.4279V36.8249H75.3001V35.1891H75.3009ZM99.4193 35.1891C99.4193 34.6143 99.7973 34.1421 100.415 34.1421C101.006 34.1421 101.404 34.594 101.404 35.1891C101.404 35.7842 101.006 36.236 100.415 36.236C99.7975 36.236 99.4193 35.7638 99.4193 35.1891ZM102.078 35.1891V32.2405H101.363V33.9519C101.137 33.6574 100.793 33.4727 100.326 33.4727C99.4065 33.4727 98.6845 34.1915 98.6845 35.1899C98.6845 36.1882 99.4061 36.907 100.326 36.907C100.793 36.907 101.137 36.7221 101.363 36.4279V36.8249H102.078V35.1891ZM84.1601 34.1084C84.6201 34.1084 84.9155 34.3957 84.9909 34.9016H83.2877C83.3639 34.4294 83.6517 34.1084 84.1603 34.1084M84.1745 33.4709C83.2125 33.4709 82.5395 34.1682 82.5395 35.1881C82.5395 36.2278 83.2395 36.9052 84.2223 36.9052C84.7167 36.9052 85.1695 36.7823 85.5679 36.447L85.2181 35.92C84.9429 36.1392 84.5925 36.2621 84.2631 36.2621C83.8031 36.2621 83.3843 36.0499 83.2813 35.4612H85.7187C85.7257 35.3728 85.7329 35.2835 85.7329 35.1879C85.7257 34.1684 85.0929 33.4707 84.1741 33.4707M92.7921 35.1879C92.7921 34.6131 93.1701 34.1409 93.7879 34.1409C94.3783 34.1409 94.7767 34.5928 94.7767 35.1879C94.7767 35.783 94.3783 36.2348 93.7879 36.2348C93.1701 36.2348 92.7919 35.7626 92.7919 35.1879M95.4495 35.1879V33.5534H94.7361V33.9519C94.5089 33.6574 94.1663 33.4727 93.6993 33.4727C92.7793 33.4727 92.0573 34.1915 92.0573 35.1899C92.0573 36.1882 92.7789 36.907 93.6993 36.907C94.1663 36.907 94.5089 36.7221 94.7361 36.4279V36.8249H95.4497V35.1891L95.4495 35.1879ZM88.7611 35.1879C88.7611 36.1798 89.4543 36.905 90.5123 36.905C91.0067 36.905 91.3361 36.7954 91.6923 36.5151L91.3495 35.9404C91.0815 36.1322 90.8001 36.2348 90.4895 36.2348C89.9197 36.2278 89.5007 35.8174 89.5007 35.1879C89.5007 34.5583 89.9197 34.1481 90.4895 34.1409C90.7993 34.1409 91.0807 34.2435 91.3495 34.4354L91.6923 33.8606C91.3355 33.5803 91.0061 33.4707 90.5123 33.4707C89.4543 33.4707 88.7611 34.1957 88.7611 35.1879ZM97.9631 33.4707C97.5513 33.4707 97.2831 33.6626 97.0977 33.9499V33.5534H96.3903V36.8231H97.1049V34.9902C97.1049 34.4491 97.3383 34.1485 97.8049 34.1485C97.9577 34.1463 98.1094 34.1743 98.2513 34.2308L98.4713 33.5606C98.3133 33.4986 98.1073 33.4713 97.9627 33.4713M78.8299 33.8134C78.4865 33.5879 78.0133 33.4713 77.4913 33.4713C76.6597 33.4713 76.1243 33.8684 76.1243 34.5181C76.1243 35.0512 76.5229 35.3801 77.2569 35.4827L77.5941 35.5305C77.9855 35.5853 78.1703 35.6879 78.1703 35.8726C78.1703 36.1254 77.9103 36.2697 77.4221 36.2697C76.9277 36.2697 76.5709 36.1123 76.3303 35.9276L75.9949 36.4821C76.3863 36.7693 76.8807 36.9064 77.4161 36.9064C78.3641 36.9064 78.9135 36.4617 78.9135 35.8391C78.9135 35.2644 78.4811 34.9637 77.7667 34.8611L77.4303 34.8125C77.1213 34.7727 76.8737 34.7107 76.8737 34.4916C76.8737 34.2525 77.1071 34.1086 77.4987 34.1086C77.9177 34.1086 78.3233 34.266 78.5221 34.389L78.8311 33.8142L78.8299 33.8134ZM88.0401 33.4719C87.6283 33.4719 87.3601 33.6638 87.1755 33.9511V33.5534H86.4681V36.8231H87.1819V34.9902C87.1819 34.4491 87.4153 34.1485 87.8819 34.1485C88.0347 34.1463 88.1864 34.1743 88.3283 34.2308L88.5483 33.5606C88.3903 33.4986 88.1843 33.4713 88.0397 33.4713M81.9489 33.5534H80.7817V32.5614H80.0601V33.5534H79.3943V34.2033H80.0601V35.6949C80.0601 36.4536 80.3557 36.9054 81.2001 36.9054C81.5099 36.9054 81.8667 36.8098 82.0931 36.6526L81.8869 36.0438C81.6739 36.1667 81.4405 36.2286 81.2549 36.2286C80.8981 36.2286 80.7817 36.0095 80.7817 35.6814V34.2039H81.9489V33.5534ZM71.2771 36.8239V34.7719C71.2771 33.9991 70.7827 33.4791 69.9857 33.4721C69.5667 33.4651 69.1345 33.595 68.8319 34.0539C68.6055 33.6913 68.2487 33.4721 67.7471 33.4721C67.3965 33.4721 67.0539 33.5747 66.7857 33.9576V33.5534H66.0713V36.8231H66.7913V35.0102C66.7913 34.4426 67.1073 34.1409 67.5953 34.1409C68.0693 34.1409 68.3091 34.4487 68.3091 35.003V36.8227H69.0307V35.0098C69.0307 34.4422 69.3601 34.1405 69.8339 34.1405C70.3213 34.1405 70.5539 34.4483 70.5539 35.0026V36.8223L71.2771 36.8239Z" fill="#231F20"/>
                                    <path d="M103.619 25.9471V25.469H103.494L103.349 25.7971L103.206 25.469H103.08V25.9471H103.169V25.5869L103.304 25.8977H103.396L103.531 25.5861V25.9471H103.619H103.619ZM102.826 25.9471V25.5509H102.986V25.4702H102.577V25.5509H102.737V25.9471H102.825H102.826Z" fill="#F79410"/>
                                    <path d="M89.4114 27.9979H78.5942V8.63281H89.4116L89.4114 27.9979Z" fill="#FF5F00"/>
                                    <path d="M79.28 18.3156C79.28 14.3874 81.1264 10.8882 84.0016 8.6331C81.8252 6.92361 79.1334 5.99581 76.3618 5.99989C69.5344 5.99989 64 11.5137 64 18.3156C64 25.1175 69.5344 30.6313 76.3618 30.6313C79.1334 30.6355 81.8254 29.7077 84.0018 27.9981C81.1268 25.7435 79.28 22.244 79.28 18.3156Z" fill="#EB001B"/>
                                    <path d="M104.005 18.3157C104.005 25.1176 98.4708 30.6315 91.6434 30.6315C88.8715 30.6355 86.1793 29.7077 84.0024 27.9983C86.8784 25.7432 88.7248 22.2441 88.7248 18.3157C88.7248 14.3873 86.8784 10.8883 84.0024 8.63322C86.1792 6.92378 88.8714 5.99601 91.6432 6.00001C98.4706 6.00001 104.005 11.5139 104.005 18.3157" fill="#F79E1B"/>
                                    </g>
                                    <path d="M141.85 25.8858L143.895 16.1981H147.165L145.119 25.8858H141.85ZM156.936 16.4069C156.288 16.2106 155.273 16 154.005 16C150.772 16 148.496 17.314 148.477 19.1971C148.458 20.5892 150.102 21.3658 151.343 21.8291C152.616 22.3041 153.044 22.6069 153.038 23.0308C153.029 23.6803 152.021 23.9768 151.081 23.9768C149.772 23.9768 149.076 23.83 148.002 23.4684L147.58 23.3144L147.121 25.4831C147.885 25.7536 149.298 25.9878 150.765 26C154.203 26 156.435 24.701 156.46 22.69C156.473 21.5879 155.601 20.7493 153.714 20.0579C152.571 19.6097 151.871 19.3106 151.878 18.8568C151.878 18.4541 152.471 18.0236 153.752 18.0236C154.821 18.0101 155.596 18.1984 156.2 18.3947L156.493 18.5065L156.936 16.4069ZM165.353 16.1979H162.825C162.042 16.1979 161.456 16.3704 161.113 17.0013L156.255 25.8794H159.69C159.69 25.8794 160.251 24.6857 160.378 24.4236C160.754 24.4236 164.09 24.4277 164.567 24.4277C164.665 24.7669 164.965 25.8794 164.965 25.8794H168L165.353 16.1976V16.1979ZM161.343 22.4537C161.613 21.8955 162.646 19.7455 162.646 19.7455C162.627 19.7713 162.915 19.1846 163.08 18.8209L163.301 19.6561C163.301 19.6561 163.927 21.9686 164.058 22.4535H161.343V22.4537ZM139.073 16.1979L135.871 22.8045L135.53 21.462C134.934 19.9143 133.076 18.2375 131 17.398L133.928 25.8703L137.389 25.8672L142.538 16.1978L139.073 16.1978" fill="#0E4595"/>
                                    <path d="M133.352 17H128.042L128 17.1912C132.131 17.952 134.865 19.7906 136 22L134.845 17.7762C134.646 17.1942 134.068 17.0205 133.353 17.0002" fill="#F2AE14"/>
                                    <g clip-path="url(#clip1_159_515)">
                                    <path d="M198.035 24.6146H194.082C193.812 24.6146 193.582 24.8139 193.54 25.0847L191.941 35.3629C191.909 35.5657 192.064 35.7485 192.267 35.7485H194.154C194.424 35.7485 194.655 35.5493 194.697 35.2779L195.128 32.5057C195.17 32.2344 195.4 32.0351 195.67 32.0351H196.922C199.526 32.0351 201.028 30.7574 201.421 28.2255C201.598 27.1178 201.428 26.2475 200.917 25.6379C200.355 24.9686 199.359 24.6146 198.035 24.6146ZM198.491 28.3685C198.275 29.8068 197.191 29.8068 196.144 29.8068H195.547L195.965 27.1207C195.99 26.9584 196.129 26.8388 196.291 26.8388H196.564C197.278 26.8388 197.952 26.8388 198.3 27.2514C198.507 27.4976 198.571 27.8633 198.491 28.3685Z" fill="#253B80"/>
                                    <path d="M209.852 28.3222H207.959C207.798 28.3222 207.658 28.4418 207.634 28.6041L207.55 29.141L207.417 28.9464C207.008 28.3433 206.094 28.1417 205.182 28.1417C203.09 28.1417 201.303 29.7482 200.955 32.0017C200.774 33.1258 201.031 34.2007 201.66 34.9503C202.237 35.6395 203.063 35.9267 204.045 35.9267C205.73 35.9267 206.665 34.8278 206.665 34.8278L206.58 35.3612C206.549 35.5651 206.704 35.748 206.905 35.748H208.61C208.882 35.748 209.11 35.5487 209.153 35.2773L210.176 28.7079C210.209 28.5057 210.054 28.3222 209.852 28.3222ZM207.213 32.058C207.031 33.1545 206.172 33.8907 205.078 33.8907C204.528 33.8907 204.089 33.7119 203.806 33.3731C203.527 33.0367 203.42 32.5579 203.509 32.0246C203.68 30.9374 204.553 30.1772 205.631 30.1772C206.168 30.1772 206.605 30.3583 206.893 30.7C207.182 31.0452 207.296 31.527 207.213 32.058Z" fill="#253B80"/>
                                    <path d="M219.934 28.3223H218.032C217.85 28.3223 217.68 28.4137 217.577 28.5667L214.953 32.4852L213.841 28.7196C213.771 28.484 213.557 28.3223 213.314 28.3223H211.445C211.218 28.3223 211.06 28.5473 211.132 28.7642L213.227 34.999L211.257 37.8187C211.102 38.0408 211.259 38.3461 211.526 38.3461H213.426C213.607 38.3461 213.775 38.257 213.878 38.107L220.205 28.8468C220.356 28.6253 220.201 28.3223 219.934 28.3223Z" fill="#253B80"/>
                                    <path d="M226.233 24.6146H222.279C222.009 24.6146 221.779 24.8139 221.737 25.0847L220.138 35.3629C220.106 35.5657 220.261 35.7485 220.463 35.7485H222.492C222.68 35.7485 222.841 35.6091 222.871 35.4192L223.325 32.5057C223.366 32.2344 223.597 32.0351 223.867 32.0351H225.118C227.722 32.0351 229.225 30.7574 229.618 28.2255C229.795 27.1178 229.625 26.2475 229.113 25.6379C228.552 24.9686 227.556 24.6146 226.233 24.6146ZM226.689 28.3685C226.473 29.8068 225.389 29.8068 224.341 29.8068H223.745L224.164 27.1207C224.189 26.9584 224.326 26.8388 224.489 26.8388H224.762C225.475 26.8388 226.149 26.8388 226.497 27.2514C226.705 27.4976 226.768 27.8633 226.689 28.3685Z" fill="#179BD7"/>
                                    <path d="M238.049 28.3222H236.157C235.995 28.3222 235.856 28.4418 235.832 28.6041L235.748 29.141L235.615 28.9464C235.206 28.3433 234.292 28.1417 233.38 28.1417C231.288 28.1417 229.502 29.7482 229.154 32.0017C228.974 33.1258 229.23 34.2007 229.859 34.9503C230.437 35.6395 231.261 35.9267 232.243 35.9267C233.929 35.9267 234.863 34.8278 234.863 34.8278L234.779 35.3612C234.747 35.5651 234.902 35.748 235.105 35.748H236.81C237.079 35.748 237.31 35.5487 237.352 35.2773L238.375 28.7079C238.407 28.5057 238.252 28.3222 238.049 28.3222ZM235.41 32.058C235.229 33.1545 234.369 33.8907 233.274 33.8907C232.726 33.8907 232.285 33.7119 232.003 33.3731C231.723 33.0367 231.618 32.5579 231.706 32.0246C231.878 30.9374 232.749 30.1772 233.827 30.1772C234.365 30.1772 234.802 30.3583 235.09 30.7C235.38 31.0452 235.494 31.527 235.41 32.058Z" fill="#179BD7"/>
                                    <path d="M240.28 24.8966L238.657 35.363C238.626 35.5658 238.781 35.7486 238.982 35.7486H240.614C240.885 35.7486 241.115 35.5494 241.156 35.278L242.756 25.0004C242.788 24.7976 242.633 24.6141 242.431 24.6141H240.605C240.444 24.6147 240.305 24.7343 240.28 24.8966Z" fill="#179BD7"/>
                                    </g>
                                    <path d="M216.843 19.8182L217.145 17.9314L216.471 17.9161H213.25L215.488 3.99316C215.495 3.95113 215.518 3.91194 215.551 3.88411C215.584 3.85628 215.626 3.84094 215.67 3.84094H221.101C222.904 3.84094 224.148 4.20899 224.798 4.93544C225.102 5.27623 225.296 5.63235 225.39 6.02426C225.488 6.43547 225.49 6.92678 225.394 7.526L225.387 7.56973V7.95368L225.692 8.12294C225.948 8.25642 226.152 8.4092 226.308 8.58414C226.569 8.87552 226.737 9.24584 226.808 9.68489C226.882 10.1364 226.858 10.6737 226.737 11.282C226.598 11.9818 226.374 12.5912 226.07 13.0899C225.791 13.5494 225.436 13.9305 225.014 14.2259C224.611 14.5065 224.132 14.7195 223.591 14.8558C223.066 14.9898 222.468 15.0574 221.812 15.0574H221.389C221.087 15.0574 220.793 15.1642 220.563 15.3556C220.332 15.551 220.179 15.8179 220.132 16.1099L220.1 16.2797L219.565 19.6052L219.541 19.7273C219.535 19.766 219.524 19.7853 219.508 19.7983C219.493 19.8103 219.472 19.8182 219.452 19.8182H216.843Z" fill="#253B80"/>
                                    <path d="M226.259 7.20447C226.243 7.31146 226.225 7.42084 226.205 7.53321C225.5 11.3293 223.088 12.6407 220.007 12.6407H218.439C218.062 12.6407 217.744 12.9276 217.686 13.3173L216.883 18.6585L216.655 20.1725C216.617 20.4283 216.805 20.659 217.051 20.659H219.833C220.163 20.659 220.443 20.408 220.494 20.0673L220.522 19.919L221.046 16.4332L221.079 16.2419C221.13 15.9 221.411 15.649 221.74 15.649H222.156C224.852 15.649 226.962 14.5014 227.578 11.1805C227.836 9.79317 227.702 8.6348 227.021 7.82011C226.814 7.57445 226.559 7.37063 226.259 7.20447Z" fill="#179BD7"/>
                                    <path d="M225.269 7.47147C225.162 7.43839 225.052 7.40832 224.939 7.38126C224.825 7.3548 224.709 7.33135 224.589 7.31091C224.17 7.23874 223.71 7.20447 223.218 7.20447H219.064C218.962 7.20447 218.865 7.22912 218.778 7.27362C218.586 7.37164 218.444 7.56467 218.409 7.801L217.525 13.758L217.5 13.9317C217.558 13.5397 217.873 13.251 218.246 13.251H219.801C222.856 13.251 225.247 11.9311 225.946 8.1125C225.967 7.99945 225.984 7.8894 226 7.78176C225.823 7.68194 225.632 7.59655 225.425 7.52378C225.374 7.50574 225.322 7.4883 225.269 7.47147Z" fill="#222D65"/>
                                    <path d="M218.04 7.58476C218.075 7.35073 218.223 7.15957 218.422 7.0631C218.513 7.01903 218.613 6.99462 218.719 6.99462H223.032C223.543 6.99462 224.02 7.02856 224.455 7.10002C224.58 7.12027 224.701 7.14349 224.818 7.16969C224.936 7.19649 225.05 7.22627 225.161 7.25902C225.216 7.27569 225.271 7.29296 225.324 7.31023C225.538 7.38229 225.737 7.46744 225.921 7.5657C226.137 6.16806 225.919 5.21645 225.174 4.35476C224.354 3.40613 222.873 3 220.977 3H215.475C215.088 3 214.757 3.28584 214.698 3.6747L212.406 18.4223C212.361 18.7141 212.582 18.9773 212.872 18.9773H216.269L217.122 13.4838L218.04 7.58476Z" fill="#253B80"/>
                                    <defs>
                                    <clipPath id="clip0_159_515">
                                    <rect width="40" height="31" fill="white" transform="translate(64 6)"/>
                                    </clipPath>
                                    <clipPath id="clip1_159_515">
                                    <rect width="51" height="19.3409" fill="white" transform="translate(192 20.6592)"/>
                                    </clipPath>
                                    </defs>
                                </svg>
                            </div>
                        </div>
                    </div>
                </aside>
            </div>

            {:else}
            <p>Geen producten gevonden in uw winkelmand.</p>
        {/if}
    </div>
</section>

<style>
    .card--simple {
        @apply border-2 border-[#D9D9D9] rounded-md;
    }
    .card--simple__header {
        @apply bg-[#F2F2F2] py-4 px-5 text-theme-dark-blue text-lg border-b-2 border-[#D9D9D9];
    }
    .card--simple__body {
        @apply flex flex-col p-6 bg-white;
    }
    .card--simple__body h5 {
        @apply whitespace-nowrap flex items-center text-[#E3E3E3] uppercase text-[10px] font-bold after:h-[2px] after:ml-4 after:block after:content-[''] after:w-full after:bg-[#E9E9E9];
    }
    .card--simple tr {
        @apply border-none;
    }
</style>