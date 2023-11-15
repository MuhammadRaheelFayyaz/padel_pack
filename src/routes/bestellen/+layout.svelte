<script>
	import Authentication from "$lib/components/Authentication.svelte";
</script>

<Authentication>
    <section class="bg-[#F5F5F5]">
        <div class="container">
            <slot/>
        </div>
    </section>
</Authentication>