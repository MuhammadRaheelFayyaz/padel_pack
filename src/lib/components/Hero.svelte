<script>
    export let data = [];
    let usps;

    if (data.subtitle) {
        usps = data.subtitle.split(';');
    }
</script>

{#if data}
    <section class="section pt-64 md:pt-40 lg:pt-32 xl:pt-52 overflow-hidden">
        <div class="container">
            <div class="md:ml-[50%]">
                <div class="relative z-10 md:flex-1">
                    <header class="styled">
                        {#if usps}
                            <div class="flex flex-col md:flex-row md:items-center gap-3 lg:gap-6 mb-4">
                                {#each usps as usp}
                                    <h5 class="flex items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4 mr-1 text-primary">
                                            <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                        </svg>                      
                                        {usp}
                                    </h5>
                                {/each}
                            </div>
                        {/if}
                        {#if data.title}
                            <h2>{@html data.title}</h2>
                        {/if}
                    </header>
                    {#if data.content}
                        <div class="text-xs leading-5 md:text-lg">
                            {@html data.content}
                        </div>
                    {/if}

                    {#if data.button_url}
                        <a href={data.button_url} class="flex items-center button button-primary mt-10">
                            {data.button_text}
                            <svg width="14" height="10" class="ml-2" viewBox="0 0 14 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M9.159 7.70614C9.08531 7.77481 9.02621 7.85761 8.98522 7.94961C8.94423 8.04161 8.92218 8.14092 8.92041 8.24162C8.91863 8.34232 8.93716 8.44235 8.97488 8.53574C9.0126 8.62913 9.06874 8.71396 9.13996 8.78518C9.21118 8.8564 9.29601 8.91255 9.3894 8.95027C9.48279 8.98799 9.58282 9.00651 9.68352 9.00474C9.78423 9.00296 9.88354 8.98092 9.97554 8.93993C10.0675 8.89893 10.1503 8.83983 10.219 8.76614L13.47 5.51614L14 4.98614L13.47 4.45614L10.22 1.20614C10.0786 1.06946 9.8892 0.993771 9.69255 0.995386C9.4959 0.997002 9.30775 1.07579 9.16863 1.21478C9.02951 1.35377 8.95054 1.54185 8.94874 1.73849C8.94694 1.93514 9.02245 2.12463 9.159 2.26614L11.129 4.23614L0.75 4.23614C0.551087 4.23614 0.360323 4.31516 0.21967 4.45581C0.0790175 4.59647 -1.65748e-07 4.78723 -1.74443e-07 4.98614C-1.83137e-07 5.18506 0.0790174 5.37582 0.21967 5.51647C0.360323 5.65713 0.551087 5.73614 0.75 5.73614L11.129 5.73614L9.159 7.70614Z" fill="#012242"/>
                            </svg>
                        </a>
                    {/if}
                </div>
            </div>
        </div>
        {#if data.media[0].url}
            <img 
                src={data.media[0].url}
                alt={data.media[0].name}
                class="absolute inset-0 w-full h-full object-cover object-[-50px] scale-110 md:scale-100 md:object-top"
            />
        {/if}
    </section>
{/if}

<style>
    .section {
        @apply h-[800px];
    }
    header h2 {
        @apply lg:text-5xl lg:leading-[62px];
    }
</style>