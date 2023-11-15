<script>
    import { onMount, onDestroy } from 'svelte';

    export let isOpen = false;

    onMount(() => {
        if (isOpen) {
            document.body.classList.add('no-scroll');
        }
    });

    onDestroy(() => {
        document.body.classList.remove('no-scroll');
    });

    $: if (isOpen) {
        document.body.classList.add('no-scroll');
    } else {
        document.body.classList.remove('no-scroll');
    }
</script>

{#if isOpen}
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <div class="backdrop" on:click={() => isOpen = false}></div>
    <div class="modal">
        <div class="modal__inner">
            <slot />
        </div>
    </div>
{/if}

<style>
    .modal {
        @apply fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 max-w-sm;
    }
    .modal__inner {
        @apply relative bg-white p-8 rounded-xl w-full max-w-lg z-10 shadow-xl m-4;
    }
    .backdrop {
        @apply fixed inset-0 w-full h-full bg-black/20;
    }
    body.no-scroll {
        overflow: hidden;
    }
</style>
