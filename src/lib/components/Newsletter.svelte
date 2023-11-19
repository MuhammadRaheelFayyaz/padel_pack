<script>
	import { useForm } from "@getneurotic/svelte/helpers";
	import Formfield from "./Formfield.svelte";

    const form = useForm({ 
        email: '',
    });

    const handleNewsletterSignup = async () => {
        try {
            form.processing = true;
            form.error = null;
            
            const response = await $form.post('/api/newsletter');

            if (response.data.success) {
                form.success = true;
            }
        } catch (error) {
            console.error("Error signing up for newsletter:", error);
            form.error = error.response?.data?.message || error.message || 'An error occurred';
        } finally {
            form.processing = false;
        }
    }

 </script>

<!-- <h5 class="font-bold text-lg">Abonneer u op onze nieuwsbrief</h5> -->
{#if $form.successful}
    <div class="p-4 sm:p-8 bg-green-100 rounded-md text-black">
        <p>Bedankt voor uw interesse, wij nemen zo spoedig mogelijk contact met je op.</p>
    </div>

    {:else}
        <form class="relative flex flex-col sm:flex-row gap-4 items-center" on:submit|preventDefault={handleNewsletterSignup}>

            <Formfield
                id="email"
                placeholder="E-mailadres"
                required
                class="!bg-white !px-6 !py-4 !rounded-md !w-full !text-black"
                bind:error={$form.errors.email}
                bind:value={$form.email}
            />
            <button type="submit" class="whitespace-nowrap !w-full sm:!w-fit bg-[#46C410] px-6 py-5 rounded-md text-sm" class:loading={$form.processing}
            >
                Gratis aanmelden                       
            </button>
        </form>
        <p class="text-xs text-white/50 italic mt-2">Door mij in te schrijven ga ik akkoord met het gegevensbeschermingsbeleid.</p>
{/if}

<!-- Placeholder for error message -->
{#if $form.error}
<p class="text-red-500 mt-2">{$form.error}</p>
{/if}