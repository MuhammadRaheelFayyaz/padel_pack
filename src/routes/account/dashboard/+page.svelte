<script>
	import { page } from '$app/stores';
	import { derived } from 'svelte/store';
	import { useForm } from '@getneurotic/svelte/helpers';
	import cart from '$lib/stores/cart';
	import customer from '$lib/stores/customer';
    const { products } = $page.data;
    
	const today = new Date();
	const thisMonth = today.getMonth() + 1;

	const monthNamesDutch = [
		'Januari', 'Februari', 'Maart', 'April', 'Mei', 'Juni',
		'Juli', 'Augustus', 'September', 'Oktober', 'November', 'December'
	];

	const monthNamesEnglish = [
		'January', 'February', 'March', 'April', 'May', 'June',
		'July', 'August', 'September', 'October', 'November', 'December'
	];

	const plans = monthNamesDutch.map((month, index) => ({
		value: monthNamesEnglish[index],
		label: month,
		active: true
	}));

	function getNextMonths(startMonth) {
		const months = [];
		for (let i = 0; i < 6; i++) {
			const monthIndex = (startMonth + i - 1) % 12;
			months.push(plans[monthIndex]);
		}
		return months;
	}    

	const monthsToShow = getNextMonths(thisMonth);
    let selectedMonth = monthsToShow[0];

	export let currentMonth = thisMonth;
	export let changePackageScreen = false;
	export let changeOrderPackage = false;

	export const total = derived(cart, ($cart) => {
		return $cart.reduce((totalCost, item) => {
			const itemPrice = item.discount ? item.price * 0.5 : item.price;
			return totalCost + itemPrice * item.quantity;
		}, 0);
	});

	$: {
		if ($cart.length > 0 && $cart[0].discount === undefined) {
			$cart[0].discount = true;
		}
	}

    const deliveryExceptions = useForm({ months: $customer.delivery_exceptions || [] });

    function toggleMonth(monthName) {
        const index = $deliveryExceptions.months.indexOf(monthName);

        if (index === -1) {
            $deliveryExceptions.months.push(monthName);
        } else {
            $deliveryExceptions.months.splice(index, 1);
        }

        const planIndex = plans.findIndex(plan => plan.value === monthName);
        if (planIndex !== -1) {
            plans[planIndex].active = !plans[planIndex].active;
        }

        const monthsToSend = $deliveryExceptions.months.join(',');

        $deliveryExceptions.post(`/api/customers/${$customer.id}/delivery_exceptions`, {
            body: new URLSearchParams({ months: monthsToSend }),
            headers: { 'Remember-Token': $customer.remember_token },
        });
    }
    function setCurrentMonth(monthValue) {
        currentMonth = monthNamesEnglish.indexOf(monthValue) + 1;
        selectedMonth = monthsToShow.find(m => m.value === monthValue);
    }

    function toggleCurrentMonth() {
        const currentMonthName = monthNamesEnglish[currentMonth - 1];
        toggleMonth(currentMonthName);
        changePackageScreen = !changePackageScreen;
    }
</script>


<div class="flex flex-col lg:flex-row gap-8 w-full">
	<div class="w-full lg:w-2/3">
		<div class="grid gap-10">

			<!-- Delivery Months -->
			<div class="vstack gap-4 overflow-hidden">
                <h3 class="title">Planning levering</h3>
                <div class="delivery-months !mt-0">
                    {#each monthsToShow as month, index}
                        {@const isActive = !$deliveryExceptions.months.includes(month.value) && month.active}
                        <button 
                            class="month" 
                            class:selected={selectedMonth.label === month.label}
                            disabled={index > 2}
                            on:click={() => setCurrentMonth(month.value)}
                        >
                            {#if index <= 2}
                                {#if isActive}
                                    <svg viewBox="0 0 27 27" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <circle cx="13.5" cy="13.5" r="13.5" fill="#46C410" />
                                        <circle cx="13.5" cy="13.5" r="13" stroke="#46C410" />
                                        <path
                                            d="M19.7022 9.26045C19.6162 9.17792 19.5139 9.11242 19.4012 9.06772C19.2885 9.02301 19.1676 9 19.0454 9C18.9233 9 18.8024 9.02301 18.6897 9.06772C18.577 9.11242 18.4747 9.17792 18.3887 9.26045L11.4973 15.8289L8.60205 13.0642C8.51277 12.9821 8.40737 12.9175 8.29188 12.8742C8.17638 12.8309 8.05306 12.8096 7.92894 12.8117C7.80482 12.8137 7.68234 12.839 7.56849 12.8861C7.45464 12.9332 7.35165 13.0012 7.26541 13.0862C7.17916 13.1712 7.11134 13.2715 7.06583 13.3814C7.02032 13.4913 6.99799 13.6087 7.00014 13.7269C7.00229 13.845 7.02886 13.9616 7.07834 14.07C7.12783 14.1784 7.19925 14.2764 7.28853 14.3585L10.8406 17.7396C10.9266 17.8221 11.0289 17.8876 11.1416 17.9323C11.2543 17.977 11.3752 18 11.4973 18C11.6195 18 11.7404 17.977 11.8531 17.9323C11.9658 17.8876 12.0681 17.8221 12.1541 17.7396L19.7022 10.5548C19.7961 10.4723 19.871 10.3722 19.9223 10.2609C19.9735 10.1495 20 10.0292 20 9.90761C20 9.78601 19.9735 9.66573 19.9223 9.55435C19.871 9.44297 19.7961 9.3429 19.7022 9.26045Z"
                                            fill="white"
                                        />
                                    </svg>
                                {:else}
                                    <svg viewBox="0 0 27 27" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <circle cx="13.5" cy="13.5" r="13.5" fill="#EB4335" />
                                        <circle cx="13.5" cy="13.5" r="13" stroke="#EB4335" />
                                        <path
                                            d="M9.25714 17.7429L17.7429 9.25714M9.25714 9.25714L17.7429 17.7429"
                                            stroke="white"
                                            stroke-width="2"
                                            stroke-linecap="round"
                                        />
                                    </svg>
                                {/if}
                            {/if}
                            <span>{month.label}</span>
                        </button>
                    {/each}
				</div>
				{#if $deliveryExceptions.errors.months}
                    <p class="form-error">{$deliveryExceptions.errors.months}</p>
                {/if}
			</div>

			<!-- Pack banner -->
			<div class="order-banner relative overflow-hidden">
				{#if !changePackageScreen}
                    <div class="bg-[#16191B] px-6 py-4 text-white overflow-hidden h-[246px]">
						<h5 class="text-xl text-white font-bold">Jouw bestelling</h5>
						<h3 class="text-2xl font-normal mb-4">{$customer?.products ? $customer.products[0].title : 'Geen bestelling(en)'}</h3>

                            {#if $customer?.products}
							<p>
								Gepland voor
								{currentMonth === 0
									? plans[11][Object.keys(plans[11])[0]]
									: plans[currentMonth - 1][Object.keys(plans[currentMonth - 1])[0]]}, wijzigen kan tot
								<strong
									>24 {currentMonth === 0
										? plans[11][Object.keys(plans[11])[0]]
										: plans[currentMonth - 1][Object.keys(plans[currentMonth - 1])[0]]}</strong
								>
							</p>
							<button
								class="button button-white !rounded-md !px-4 !font-normal !mt-10"
								on:click={() => (changePackageScreen = !changePackageScreen)}
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 24 24"
									fill="currentColor"
									class="w-6 h-6 mr-2"
								>
									<path
										fill-rule="evenodd"
										d="M11.828 2.25c-.916 0-1.699.663-1.85 1.567l-.091.549a.798.798 0 01-.517.608 7.45 7.45 0 00-.478.198.798.798 0 01-.796-.064l-.453-.324a1.875 1.875 0 00-2.416.2l-.243.243a1.875 1.875 0 00-.2 2.416l.324.453a.798.798 0 01.064.796 7.448 7.448 0 00-.198.478.798.798 0 01-.608.517l-.55.092a1.875 1.875 0 00-1.566 1.849v.344c0 .916.663 1.699 1.567 1.85l.549.091c.281.047.508.25.608.517.06.162.127.321.198.478a.798.798 0 01-.064.796l-.324.453a1.875 1.875 0 00.2 2.416l.243.243c.648.648 1.67.733 2.416.2l.453-.324a.798.798 0 01.796-.064c.157.071.316.137.478.198.267.1.47.327.517.608l.092.55c.15.903.932 1.566 1.849 1.566h.344c.916 0 1.699-.663 1.85-1.567l.091-.549a.798.798 0 01.517-.608 7.52 7.52 0 00.478-.198.798.798 0 01.796.064l.453.324a1.875 1.875 0 002.416-.2l.243-.243c.648-.648.733-1.67.2-2.416l-.324-.453a.798.798 0 01-.064-.796c.071-.157.137-.316.198-.478.1-.267.327-.47.608-.517l.55-.091a1.875 1.875 0 001.566-1.85v-.344c0-.916-.663-1.699-1.567-1.85l-.549-.091a.798.798 0 01-.608-.517 7.507 7.507 0 00-.198-.478.798.798 0 01.064-.796l.324-.453a1.875 1.875 0 00-.2-2.416l-.243-.243a1.875 1.875 0 00-2.416-.2l-.453.324a.798.798 0 01-.796.064 7.462 7.462 0 00-.478-.198.798.798 0 01-.517-.608l-.091-.55a1.875 1.875 0 00-1.85-1.566h-.344zM12 15.75a3.75 3.75 0 100-7.5 3.75 3.75 0 000 7.5z"
										clip-rule="evenodd"
									/>
								</svg>
								Beheer Pack
							</button>
                        {/if}
                    </div>
					{:else}
                    <div class="flex flex-col lg:flex-row">

						<div class="bg-[#16191B] flex flex-col-reverse md:flex-col justify-between py-8 px-6 text-white">
							{#if $customer.products[0].title}
								<h3 class="text-3xl font-normal mb-8 mt-8">
									{$customer.products[0].title}
								</h3>
							{/if}
							<button
								class="flex items-center gap-1 bg-white px-2 py-2 text-sm w-fit text-black rounded-lg"
								on:click={() => (changePackageScreen = !changePackageScreen)}
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 24 24"
									fill="currentColor"
									class="w-4 h-4"
								>
									<path
										fill-rule="evenodd"
										d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z"
										clip-rule="evenodd"
									/>
								</svg>
								Sluiten
							</button>
						</div>
						<div
							class="flex flex-col  text-theme-dark-blue bg-white py-12 px-6"
						>
							<h5 class="text-2xl mb-4">
								Levering
                                <strong>
                                    {currentMonth === 0
                                        ? plans[11][Object.keys(plans[11])[0]]
                                        : plans[currentMonth - 1][Object.keys(plans[currentMonth - 1])[0]]}
                                </strong>
							</h5>
							<div class="flex flex-wrap gap-4">
								<button 
									class="button button-dark !px-4 !rounded-md"
									on:click={() => changeOrderPackage = !changeOrderPackage}
								>
									Wijzig pakket
								</button>

                                {#if plans[currentMonth - 1].active}
                                    <button 
                                        class="button button-outline-danger !px-4 !rounded-md"
                                        on:click={toggleCurrentMonth}
                                    >
                                        Pauzeer maand
                                    </button>
                                    {:else}
                                        <button 
                                            class="button button-outline-success !px-4 !rounded-md"
                                            on:click={toggleCurrentMonth}
                                        >
                                            Activeer maand
                                        </button>
                                {/if}
							</div>
						</div>
                    </div>
					{/if}
				
					<!-- <h5 class="text-xl text-white font-bold">Bepaal zelf wanneer je ontvangt</h5>
					<h3 class="text-2xl font-normal">Ontdek het ideale Padel Pack voor jou!</h3>
					<a href="/padel-packs" class="button button-white-green mt-4 space-x-2">
						<span>Bekijk pakketten</span>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke-width="2"
							stroke="currentColor"
							class="w-6 h-6"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"
							/>
						</svg>
					</a> -->
				
			</div>

			<!-- Order history -->

				<div class="card mt-10">
					<div class="card__body">
						<h4 class="card__title">Bestelgeschiedenis</h4>

						<div class="flex flex-col text-center justify-center items-center opacity-20">
							<svg
								width="82"
								height="111"
								viewBox="0 0 82 111"
								class="opacity-70 mb-4"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
							>
								<g>
									<path
										d="M41 0C35.0108 0 29.2668 2.33892 25.0318 6.50223C20.7968 10.6655 18.4176 16.3122 18.4176 22.2V25.9H15.2937C12.1251 25.8967 9.07722 27.095 6.7847 29.2453C4.49218 31.3956 3.13162 34.3323 2.98627 37.444L0.0129177 98.309C-0.0633035 99.9457 0.198379 101.581 0.782191 103.115C1.366 104.65 2.25986 106.052 3.40987 107.238C4.55988 108.424 5.94225 109.369 7.47363 110.015C9.00501 110.662 10.6537 110.997 12.3203 111H69.6797C71.3463 110.997 72.995 110.662 74.5264 110.015C76.0578 109.369 77.4401 108.424 78.5901 107.238C79.7402 106.052 80.634 104.65 81.2178 103.115C81.8016 101.581 82.0633 99.9457 81.9871 98.309L79.0137 37.444C78.8684 34.3323 77.5078 31.3956 75.2153 29.2453C72.9228 27.095 69.8749 25.8967 66.7063 25.9H63.5824V22.2C63.5824 16.3122 61.2032 10.6655 56.9682 6.50223C52.7332 2.33892 46.9892 0 41 0ZM25.9451 22.2C25.9451 18.2748 27.5312 14.5104 30.3545 11.7348C33.1779 8.95928 37.0072 7.4 41 7.4C44.9928 7.4 48.8221 8.95928 51.6455 11.7348C54.4688 14.5104 56.0549 18.2748 56.0549 22.2V25.9H25.9451V22.2ZM71.4863 37.777L74.4596 98.679C74.4832 99.3154 74.379 99.9501 74.153 100.547C73.927 101.144 73.5835 101.691 73.1423 102.157C72.6918 102.612 72.1535 102.974 71.5589 103.221C70.9643 103.469 70.3255 103.598 69.6797 103.6H12.3203C11.6746 103.598 11.0357 103.469 10.4411 103.221C9.84655 102.974 9.30824 102.612 8.8577 102.157C8.41648 101.691 8.07305 101.144 7.84702 100.547C7.62099 99.9501 7.51679 99.3154 7.54039 98.679L10.5137 37.777C10.5718 36.5696 11.101 35.4307 11.9912 34.5969C12.8813 33.7631 14.0641 33.2987 15.2937 33.3H66.7063C67.9359 33.2987 69.1187 33.7631 70.0089 34.5969C70.899 35.4307 71.4282 36.5696 71.4863 37.777Z"
										fill="#012242"
									/>
									<path d="M73.8 30.8333H8.2L6.15 104.833H75.85L73.8 30.8333Z" fill="#012242" />
								</g>
							</svg>
							Je hebt nog <br />geen bestellingen!
						</div>
					</div>
					<div class="card__footer">
						<a href="/padel-packs" class="flex items-center justify-center">
							Bekijk pakketten
							<svg
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 24 24"
								fill="currentColor"
								class="w-6 h-6 ml-2"
							>
								<path
									fill-rule="evenodd"
									d="M16.72 7.72a.75.75 0 011.06 0l3.75 3.75a.75.75 0 010 1.06l-3.75 3.75a.75.75 0 11-1.06-1.06l2.47-2.47H3a.75.75 0 010-1.5h16.19l-2.47-2.47a.75.75 0 010-1.06z"
									clip-rule="evenodd"
								/>
							</svg>
						</a>
					</div>
				</div>

			<!-- Cart -->
			{#if $cart.length}
				<div class="card">
					<div class="card__body">
						<div class="card__title">
							<h4>Winkelmand</h4>
							<p class="text-base font-normal opacity-20 ml-2">
								{#if $cart.length == 1}
									{$cart.length} item
								{:else}
									{$cart.length} items
								{/if}
							</p>
						</div>
						<ul class="flex flex-col overflow-auto">
							{#each $cart as item}
								<li class="flex items-center gap-12">
									<img
										src={item.image}
										class="aspect-square w-24 h-24 object-contain bg-[#16191B] rounded-md"
										alt={item.title}
									/>

									<div>
										<h5 class="font-bold leading-6">{item.title}&nbsp;abonnement</h5>
										<!-- Todo: discount rule -->
									</div>
									<div class="flex items-center">
										&euro;{item.price}
									</div>
									<div class="flex items-center">
										{item.amount}
									</div>
									<div class="flex items-center">
										&euro;{item.price}
									</div>
								</li>
							{/each}
						</ul>
					</div>
					<div class="card__footer">
						<button on:click={$cart.toggle} class="flex items-center justify-center">
							Naar winkelwagen  
							<svg
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 24 24"
								fill="currentColor"
								class="w-6 h-6 ml-2"
							>
								<path
									fill-rule="evenodd"
									d="M16.72 7.72a.75.75 0 011.06 0l3.75 3.75a.75.75 0 010 1.06l-3.75 3.75a.75.75 0 11-1.06-1.06l2.47-2.47H3a.75.75 0 010-1.5h16.19l-2.47-2.47a.75.75 0 010-1.06z"
									clip-rule="evenodd"
								/>
							</svg>
						</button>
					</div>
				</div>
			{/if}
		</div>
	</div>

	<!-- Account Details -->
	<div class="w-full lg:w-1/3 flex flex-col gap-8">
		<div class="card">
			<div class="card__body">
				<h5 class="card__title">Accountgegevens</h5>

				<div class="flex flex-col space-y-4">
					<div>
						<p class="font-bold">E-mail</p>
						{#if $customer.email}
							<p>{$customer.email}</p>
						{/if}
					</div>

					<div>
						<p class="font-bold">Telefoon</p>
						{#if $customer.phone}
							<p>{$customer.phone}</p>
						{/if}
					</div>

					<div>
						<p class="font-bold">Adres</p>
						{#if $customer.address}
							<p>
								{$customer.address}
								{$customer.housenumber}<br />
								{$customer.postal_code}<br />
								{$customer.city}
							</p>
						{/if}
					</div>
				</div>
			</div>
			<div class="card__footer">
				<a href="/account/gegevens" class="flex items-center justify-center">
					<span>Details beheren</span>
					<svg
						class="w-4 h-4 ml-2"
						viewBox="0 0 16 16"
						fill="currentColor"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							d="M13.8067 4.69334C14.0667 4.43334 14.0667 4 13.8067 3.75334L12.2467 2.19334C12 1.93334 11.5667 1.93334 11.3067 2.19334L10.08 3.41334L12.58 5.91334M2 11.5V14H4.5L11.8733 6.62L9.37333 4.12L2 11.5Z"
							fill="#012242"
						/>
					</svg>
				</a>
			</div>
		</div>

        <!-- Extra feature -->
		<!-- <div class="flex flex-col justify-center bg-[#16191B] p-8 gap-8 rounded-lg text-white">
			<div>
				<h5 class="font-bold text-xl mb-2">Deel & verdien!</h5>
				<p>
					Voor elke vriend die je aanmeldt en een box bestelt, <strong>krijg je 50% korting</strong>
					op je volgende box. Deel de liefde voor padel en profiteer samen van geweldige besparingen.
					Hoe meer vrienden je aanmeldt, hoe meer je bespaart. Begin nu met delen!
				</p>
			</div>
			<form>
				<div class="form-group">
					<input type="mail" placeholder="E-mailadres" class="input" />
				</div>
				<button class="button button-white mx-auto mt-10"> Nodig vriend(in) uit </button>
			</form>
		</div> -->
	</div>
</div>

{#if changeOrderPackage}

	<div class="modal px-8">
		<div class="modal__inner relative">
			<button
				class="absolute top-4 right-4"
				on:click={() => changeOrderPackage = !changeOrderPackage}
			>
				<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6">
					<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
				</svg>			  
			</button>
			<ul class="flex flex-col gap-8 max-h-[540px] overflow-auto">
				{#each products as product}
					<li class="flex flex-col gap-4 py-2 justify-between text-theme-dark-blue">
						<div class="flex flex-col text-sm">
							<h3 class="text-2xl">{product.properties.title}</h3>
							<p class="pl-4">
								{#if product.properties.balls === 1} 
									{product.properties.balls} blik
	
									{:else}
									{product.properties.balls} blikken
								{/if}
								padelballen + {product.properties.overgrip} overgrips
							</p>
						</div>
						<div>
							<button class="button button-dark !button-sm whitespace-nowrap !rounded-md w-full md:w-fit">
								Kies pakket ({product.properties.price})
							</button>
						</div>
					</li>
				{/each}
			</ul>
		</div>
	</div>
{/if}

<style lang="scss">
	.title {
		@apply text-2xl font-bold mb-6;
	}

	.delivery-months {
		@apply flex gap-4 overflow-auto pb-4;

		.month {
			@apply relative flex-none flex flex-col items-center justify-center rounded-xl border-2 border-transparent shadow-lg aspect-video opacity-100 whitespace-nowrap bg-white w-[112px] h-[104px];

			&.active {
				@apply border-[#012242] opacity-100;
			}

			svg {
				@apply absolute top-1.5 right-1.5 w-6 h-6;
			}

			span {
				@apply font-bold;
			}
            &.selected {
                @apply border-[#012242];
            }
            &:disabled {
                @apply text-theme-dark-blue/30;
            }
		}
	}

	.modal {
		@apply fixed top-1/2 -translate-x-1/2 -translate-y-1/2 left-1/2 w-full max-w-xl;

        .modal__inner {
            @apply p-8 bg-white border-2 border-[#012242]/20 rounded-2xl shadow-2xl;
        }
	}

	.order-banner {
		@apply rounded-lg min-h-[246px] overflow-hidden;
	}

</style>
