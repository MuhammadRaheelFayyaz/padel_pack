<script>
	import { useForm } from "@getneurotic/svelte/helpers";
	import Formfield from "../../lib/components/Formfield.svelte";

	export let data;

	const resetPasswordForm = useForm({
        token: data.token,
        password: '',
        confirm_password: ''
    });

    async function handleResetPassword() {
        $resetPasswordForm.post('/api/auth/reset-password/verify-token', {
            onSuccess: (props) => {
                if (props.success) {} else {}
            }
        });
    }
</script>

<div class="flex flex-col h-screen text-black pt-40">
    <div class="flex flex-col w-full max-w-xl mx-auto px-8">
        <h1>Reset je wachtwoord</h1>

        {#if $resetPasswordForm.succesful}
                <div class="bg-green-200 text-green-700 p-4 rounded-lg">
                    <p>Je wachtwoord is successvol gewijzigd.</p>
                </div>
            {:else}

                <form class="form--dark mt-8" on:submit|preventDefault={handleResetPassword}>
                    <div class="flex flex-col gap-4">
                        <Formfield
                            type="password"
                            id="password"
                            placeholder="Nieuw Wachtwoord"
                            required
                            bind:error={$resetPasswordForm.errors.password}
                            bind:value={$resetPasswordForm.password}
                        />
                        <Formfield
                            type="password"
                            id="confirm_password"
                            placeholder="Bevestig Nieuw Wachtwoord"
                            required
                            bind:error={$resetPasswordForm.errors.confirm_password}
                            bind:value={$resetPasswordForm.confirm_password}
                        />
                    </div>
                    <button class="button button-dark mt-8">Nieuw wachtwoord aanvragen</button>
                </form>
        {/if}
    </div>
</div>
