<script>
    export let stars = null;
    export let description = null;
    export let author = null;
</script>

<div class="review">
    <div class="flex gap-1">
        {#each Array(Number(stars)) as _}
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5 text-primary">
                <path fill-rule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clip-rule="evenodd" />
              </svg>					  
        {/each}
    </div>
    <p class="italic">
        {description}
    </p>
    <p class="author">
        {author}
    </p>
</div>

<style>
    .review {
        @apply flex flex-col bg-[#16191B] p-6 min-w-[90%] gap-4 rounded-md;
    }
    .author {
        @apply text-base font-bold;
    }
</style>