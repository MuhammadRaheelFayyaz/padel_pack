<script>
  import ReviewItem from "./ReviewItem.svelte";
  import { writable } from "svelte/store";
  import { onMount } from "svelte";

  export let data = [];

  let isMobile = false;
  let container;
  let itemElements = [];

  const middleIndex = Math.floor(data.length / 2) - 1;
  const activeSlide = writable(middleIndex);

  onMount(() => {
    isMobile = window.innerWidth <= 768; 

    const itemWidth = itemElements[0].offsetWidth;
    const initialScroll = itemWidth * (middleIndex - 1);
    container.scrollLeft = initialScroll;
    container.addEventListener("scroll", updateActiveSlide);
  });

  function updateActiveSlide() {
    const itemWidth = itemElements[0].offsetWidth;
    const index = Math.floor((container.scrollLeft + itemWidth / 2) / itemWidth);
    let adjustedIndex = index;

    if (container.scrollLeft > itemWidth * index) {
      adjustedIndex++;
    }

    activeSlide.set(adjustedIndex); 
  }

  function scrollLeft() {
    const itemWidth = itemElements[0].offsetWidth;
    container.scrollBy({ left: -itemWidth, behavior: "smooth" });
  }

  function scrollRight() {
    const itemWidth = itemElements[0].offsetWidth;
    container.scrollBy({ left: itemWidth, behavior: "smooth" });
  }

</script>

<div class="relative">
  <div class="carousel">
    <div class="carousel__wrapper">
      <button class="carousel__button carousel--prev" on:click={scrollLeft}>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
        
      </button>
      <div class="carousel__container" bind:this={container}>
        {#each data as item, index}
          <div class={`carousel__item ${isMobile ? (index === $activeSlide ? 'opacity-100' : 'opacity-60') : (index === $activeSlide || index === $activeSlide + 1 || index === $activeSlide + 2 ? 'opacity-100' : 'opacity-60')}`} bind:this={itemElements[index]}>
            <ReviewItem stars={item.properties.stars} description={item.properties.description} author={item.properties.author} />
          </div>
        {/each}
      </div>
      <button class="carousel__button carousel--next" on:click={scrollRight}>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
          <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
        </svg>        
      </button>
    </div>
    <div class="carousel__indicators">
      {#each data as _, index}
        <div class={`carousel__indicator ${index === $activeSlide ? 'active-slide' : ''}`} />
      {/each}
    </div>
  </div>
</div>

<style>
  .carousel {
    @apply relative w-full overflow-hidden;
  }

  .carousel__wrapper {
    @apply flex items-center justify-center relative;
  }

  .carousel__container {
    @apply flex gap-4 overflow-auto ml-4;
    scroll-snap-type: x mandatory;
    -webkit-overflow-scrolling: touch;
    transition: transform 0.3s ease-in-out;
    transform-origin: left center;
  }

  .carousel__item {
    @apply w-[380px] min-w-[335px] bg-[#16181B] rounded-md;
    transition: opacity 0.3s;
    scroll-snap-align: center;
  }

  .carousel__button {
    @apply hidden absolute top-1/2 -translate-y-1/2 md:flex justify-center items-center w-14 h-14 min-w-[56px] bg-white text-black rounded-full z-10;
  }

  .carousel--prev {
    @apply left-10;
  }

  .carousel--next {
    @apply right-10;
  }
  .carousel__indicators {
    @apply flex justify-center mt-4;
  }

  .carousel__indicator {
    @apply w-3 h-3 bg-gray-400 rounded-full mx-1 duration-200 md:hidden;
  }

  .active-slide {
    @apply bg-primary;
  }
</style>
