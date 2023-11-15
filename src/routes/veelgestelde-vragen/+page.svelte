<script>
    import { page } from '$app/stores';
	import FaqItem from "$lib/components/FaqItem.svelte";
	
    const { page: cp, faqs } = $page.data;
    let currentCategory = null;
    let categories = new Set();

    if (faqs) {
        faqs.forEach(element => {
        categories.add(element.properties.category[0]);
        });
    }

    let uniqueCategories = Array.from(categories);

    function setCategory(index) {
        currentCategory = index;
    }

    if (currentCategory === null) {
        currentCategory = uniqueCategories.indexOf("Algemeen");
    }

</script>

<!-- Faq -->
<section class="section pt-40 lg:py-40">
    <div class="container">
        <header class="styled">
            <h2 class="mb-5">Informatiecentrum</h2>

            <div class="categories">
                {#each uniqueCategories as item, index}
                    <button
                        class="button whitespace-nowrap"
                        class:active-faq={index == currentCategory}
                        class:button-primary={item === currentCategory}
                        on:click={() => setCategory(index)}
                    >
                        {item}
                    </button>
                {/each}
                <div class="absolute top-0 bottom-0 right-0 w-1/2 lg:hidden bg-gradient-to-r from-transparent to-black pointer-events-none"></div>
            </div>
        </header>
        <div class="faq-items">
            {#each faqs as item, index}
                {#if currentCategory === index || uniqueCategories[currentCategory] === item.properties.category[0]}
                    <div class="w-full">
                        <FaqItem
                            question={item.properties.question}
                            answer={item.properties.answer}
                        />
                    </div>
                {/if}
            {/each}
        </div>
    </div>
</section>

<style>
    .faq-items {
        @apply grid grid-cols-1 md:grid-cols-2 gap-x-12 divide-y divide-white/20;
    }
    .categories {
        @apply flex flex-wrap gap-4 mb-14;
    }
</style>