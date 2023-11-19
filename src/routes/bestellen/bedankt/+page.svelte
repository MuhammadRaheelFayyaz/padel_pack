<script>
    import { page } from '$app/stores';
	import customer from '$lib/stores/customer';

    const { blocks } = $page.data;
    const data = blocks.find(block => block.title === 'order-thankyou')?.properties;
</script>

<div class="pt-40">
    <div class="flex flex-col items-center text-center space-y-2 text-lg">
        {#if data.title}
            <h1>{data.title}</h1>
        {/if}
        {#if data.content}
            {@html data.content}
        {/if}
        {#if $customer.email}
            <strong>{$customer.email}</strong>
        {/if}
    </div>
    <div class="flex flex-col lg:flex-row lg:mt-28 xl:gap-20">
        <div class="flex flex-col gap-4 mt-28 lg:mt-0 text-base text-theme-dark-blue">
            <div>
                <h2 class="mb-2">Details</h2>
                <p>
                    Je hebt gekozen voor <strong>(Performance Pack) &euro;(11,48) in de eerste maand</strong>, daarna <strong>&euro;(22,95) per maand</strong>
                </p>
                <p class="text-sm text-[#bdbdbd]">
                    Dit pakket bestaat uit (3) overgrips & (2) blikken padelballen
                </p>
            </div>
    
            <div class="card !bg-transparent !shadow-none border-2 border-[#f1f1f1]">
                <div class="card__body text-sm !py-8">
                    <h5 class="card__title !mb-4">Contactgegevens</h5>
                    {#if customer}
                        <p>
                            {$customer.first_name} {$customer.last_name}<br>
                            {$customer.street} en {$customer.housenumber}<br>
                            {$customer.postal_code} {$customer.city}
                        </p>
                    {/if}
                </div>
            </div>

            <div class="card !bg-transparent !shadow-none border-2 border-[#f1f1f1]">
                <div class="card__body text-sm !py-8">
                    <h5 class="card__title !mb-4">Verzendgegevens</h5>
                    {#if customer}
                        <p>
                            {$customer.delivery_first_name} {$customer.delivery_last_name}<br>
                            {$customer.delivery_street} en {$customer.delivery_housenumber}<br>
                            {$customer.delivery_postal_code} {$customer.delivery_city}
                        </p>
                    {/if}
                </div>
            </div>
    
            <div class="card !bg-transparent !shadow-none border-2 border-[#f1f1f1]">
                <div class="card__body text-sm !py-8">
                    <h5 class="card__title !mb-4">Betaalmethode</h5>
                    <p>
                        (iDeal) met rekening dat eindigt op <strong>(4521)</strong>
                    </p>
                </div>
            </div>
        </div>
        <div>
            <div class="share-and-earn mt-4 lg:mt-0">
                <div>
                    <h5>Deel & verdien!</h5>
                    <p>Geef 50% korting weg & verdien zelf 50% korting op je volgende box</p>
                </div>
                <form>
                    <div class="form-group">
                        <input type="mail" placeholder="E-mailadres" class="input" />
                    </div>
                    <button class="button button-success w-full sm:w-full mt-4">
                        Nodig vriend(in) uit
                    </button>
                </form>
            </div>
        </div>
    </div>
</div>

<style>
    .share-and-earn {
        @apply flex flex-col justify-center bg-[#E7E7E7] p-6 gap-8 rounded-lg text-theme-dark-blue;
    }
    .share-and-earn h5 {
        @apply font-bold text-2xl mb-2;
    }
</style>