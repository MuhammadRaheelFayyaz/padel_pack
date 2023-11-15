<script>
	import { slide } from "svelte/transition";

    export let question = null;
    export let answer = null;
    export let open = false;
</script>

<div class="faq">
    <button
        class="faq__question"
        on:click={() => open = !open}
    >
        {question}

        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 min-w-[20px] duration-300 ml-auto mr-4 {open ? 'rotate-180' : 'rotate-0'}">
            <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>          
    </button>
    {#if open}
        <div 
            transition:slide={{ duration:400 }}
            class="faq__answer"
        >
            {@html answer}
        </div>
    {/if}
</div>

<style>
    .faq {
        @apply flex flex-col w-full;
    }
    .faq__question {
        @apply flex w-full font-bold text-lg py-2 text-left;
    }
    .faq__answer {
        @apply !text-base mt-2 mb-4;
    }
</style>