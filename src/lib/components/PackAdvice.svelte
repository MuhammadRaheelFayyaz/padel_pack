<script>
  import { page } from '$app/stores';
  import cart from '$lib/stores/cart';
  import PackImage from '$lib/assets/pack-calculator.png';

  const { products } = $page.data;
  
  let packageType = null;

  let totalSteps = 3;
  let currentStep = 0;

  let question1 = '';
  let question2 = '';
  let question3 = '';

  function submitQuiz() {
    if (question1 === "<1") {
      if (question2 === "Recreatief" && question3 === "Beginnend") {
        packageType = "Starter Pack";
      } else if (question2 === "Recreatief" && question3 === "Gemiddeld") {
        packageType = "Starter Pack";
      } else if (question2 === "Recreatief" && question3 === "Ervaren") {
        packageType = "Starter Pack";
      } else if (question2 === "Fanatiek" && question3 === "Beginnend") {
        packageType = "Starter Pack";
      } else if (question2 === "Fanatiek" && question3 === "Gemiddeld") {
        packageType = "Performance Pack";
      } else if (question2 === "Fanatiek" && question3 === "Ervaren") {
        packageType = "Performance Pack";
      } else if (question2 === "Competitief" && question3 === "Beginnend") {
        packageType = "Starter Pack";
      } else if (question2 === "Competitief" && question3 === "Gemiddeld") {
        packageType = "Performance Pack";
      } else if (question2 === "Competitief" && question3 === "Ervaren") {
        packageType = "Performance Pack";
      }
    } else if (question1 === "1 - 2") {
      if (question2 === "Recreatief" && question3 === "Beginnend") {
        packageType = "Starter Pack";
      } else if (question2 === "Recreatief" && question3 === "Gemiddeld") {
        packageType = "Performance Pack";
      } else if (question2 === "Recreatief" && question3 === "Ervaren") {
        packageType = "Performance Pack";
      } else if (question2 === "Fanatiek" && question3 === "Beginnend") {
        packageType = "Starter Pack";
      } else if (question2 === "Fanatiek" && question3 === "Gemiddeld") {
        packageType = "Performance Pack";
      } else if (question2 === "Fanatiek" && question3 === "Ervaren") {
        packageType = "Performance Pack";
      } else if (question2 === "Competitief" && question3 === "Beginnend") {
        packageType = "Performance Pack";
      } else if (question2 === "Competitief" && question3 === "Gemiddeld") {
        packageType = "Performance Pack";
      } else if (question2 === "Competitief" && question3 === "Ervaren") {
        packageType = "Champion Pack";
      }
    } else if (question1 === "2>") {
      if (question2 === "Recreatief" && question3 === "Beginnend") {
        packageType = "Performance Pack";
      } else if (question2 === "Recreatief" && question3 === "Gemiddeld") {
        packageType = "Performance Pack";
      } else if (question2 === "Recreatief" && question3 === "Ervaren") {
        packageType = "Performance Pack";
      } else if (question2 === "Fanatiek" && question3 === "Beginnend") {
        packageType = "Performance Pack";
      } else if (question2 === "Fanatiek" && question3 === "Gemiddeld") {
        packageType = "Champion Pack";
      } else if (question2 === "Fanatiek" && question3 === "Ervaren") {
        packageType = "Champion Pack";
      } else if (question2 === "Competitief" && question3 === "Beginnend") {
        packageType = "Performance Pack";
      } else if (question2 === "Competitief" && question3 === "Gemiddeld") {
        packageType = "Champion Pack";
      } else if (question2 === "Competitief" && question3 === "Ervaren") {
        packageType = "Champion Pack";
      }
    }
    return false;
  }

  function addToCart() {
    const product = products.find(product => product.title === packageType);

    $cart.add(product);
  }
</script>

<div class="grid grid-cols-1 md:grid-cols-5 gap-4">
  <div class="card md:col-span-3">
    <p class="text-xs text-[#555555]">vraag {currentStep + 1} / {totalSteps}</p>
    <h3 class="text-3xl mb-10">Ontdek welke Pack bij jou past</h3>
    <form on:submit|preventDefault="{submitQuiz}">
      {#if currentStep === totalSteps - 3}

        <h4>Hoeveel keer <span>per week</span> speel je padel?</h4>

        <div class="flex flex-col md:flex-row justify-between">
          <div class="flex items-center flex-wrap gap-2">
            <label class="relative cursor-pointer flex">
              <input class="peer hidden" type="radio" name="question1" bind:group="{question1}" value="<1" required />
              <span class="select peer-checked:bg-primary peer-checked:border-primary peer-checked:text-black whitespace-nowrap w-fit">Minder dan 1</span>
            </label>
            <label class="relative cursor-pointer flex">
              <input class="peer hidden" type="radio" name="question1" bind:group="{question1}" value="1 - 2" required />
              <span class="select peer-checked:bg-primary peer-checked:border-primary peer-checked:text-black whitespace-nowrap w-fit">1 tot 2 keer</span>
            </label>
            <label class="relative cursor-pointer flex">
              <input class="peer hidden" type="radio" name="question1" bind:group="{question1}" value="2>" required />
              <span class="select peer-checked:bg-primary peer-checked:border-primary peer-checked:text-black whitespace-nowrap w-fit">Meer dan 2</span>
            </label>
          </div>
          <div class="flex justify-between items-center mt-10 md:mt-0">
            <button type="button" class="button-arrow previous" on:click="{() => { if (currentStep > 0) currentStep--; }}">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 15.75L3 12m0 0l3.75-3.75M3 12h18" />
              </svg>
            </button>

            <div class="flex items-center gap-1 mx-4">
              <div class="min-w-[12px] w-5 h-5 rounded-full bg-white"></div>
              <div class="min-w-[12px] w-3 h-3 rounded-full bg-[#525252]"></div>
              <div class="min-w-[12px] w-3 h-3 rounded-full bg-[#525252]"></div>
            </div>

            <button type="button" class="button-arrow next" class:primary={question1 !== ''} on:click="{() => { if (currentStep < totalSteps - 1) currentStep++; }}">
              
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
              </svg>
            </button>
          </div>
        </div>
      {/if}
      {#if currentStep === totalSteps - 2}
        <h4><span>Hoe serieus</span> neem je jouw padelspel</h4>
        <div class="flex flex-col md:flex-row justify-between">
          <div class="flex flex-wrap items-center gap-2">
            <label class="relative cursor-pointer flex flex-wrap">
              <input class="peer hidden" type="radio" name="question2" bind:group="{question2}" value="Recreatief" required />
              <span class="select peer-checked:bg-primary peer-checked:border-primary peer-checked:text-black whitespace-nowrap w-fit">Recreatief</span>
            </label>
            <label class="relative cursor-pointer flex flex-wrap">
              <input class="peer hidden" type="radio" name="question2" bind:group="{question2}" value="Fanatiek" required />
              <span class="select peer-checked:bg-primary peer-checked:border-primary peer-checked:text-black whitespace-nowrap w-fit">Fanatiek</span>
            </label>
            <label class="relative cursor-pointer flex flex-wrap">
              <input class="peer hidden" type="radio" name="question2" bind:group="{question2}" value="Competitief" required />
              <span class="select peer-checked:bg-primary peer-checked:border-primary peer-checked:text-black whitespace-nowrap w-fit">Competitief</span>
            </label>
          </div>
          <div class="flex flex-wrap justify-between items-center mt-10 md:mt-0">
            <button type="button" class="button-arrow previous" on:click="{() => { if (currentStep > 0) currentStep--; }}">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 15.75L3 12m0 0l3.75-3.75M3 12h18" />
              </svg>
            </button>

            <div class="flex items-center gap-1 mx-4">
              <div class="min-w-[12px] w-3 h-3 rounded-full bg-[#525252]"></div>
              <div class="min-w-[12px] w-5 h-5 rounded-full bg-white"></div>
              <div class="min-w-[12px] w-3 h-3 rounded-full bg-[#525252]"></div>
            </div>

            <button type="button" class="button-arrow next" class:primary={question2 !== ''} on:click="{() => { if (currentStep < totalSteps - 1) currentStep++; }}">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
              </svg>
            </button>
          </div>
        </div>
      {/if}
      {#if currentStep === totalSteps - 1}
        <h4>Welk <span>niveau</span> schat je jezelf?</h4>

        <div class="flex flex-col md:flex-row justify-between">
          <div class="flex flex-wrap items-center gap-2">
            <label class="relative cursor-pointer flex">
              <input class="peer hidden" type="radio" name="question3" bind:group="{question3}" value="Beginnend" required />
              <span class="select peer-checked:bg-primary peer-checked:border-primary peer-checked:text-black whitespace-nowrap w-fit">Beginnend</span>
            </label>
            <label class="relative cursor-pointer flex">
              <input class="peer hidden" type="radio" name="question3" bind:group="{question3}" value="Gemiddeld" required />
              <span class="select peer-checked:bg-primary peer-checked:border-primary peer-checked:text-black whitespace-nowrap w-fit">Gemiddeld</span>
            </label>
            <label class="relative cursor-pointer flex">
              <input class="peer hidden" type="radio" name="question3" bind:group="{question3}" value="Ervaren" required />
              <span class="select peer-checked:bg-primary peer-checked:border-primary peer-checked:text-black whitespace-nowrap w-fit">Ervaren</span>
            </label>
          </div>
          <div class="flex justify-between items-center mt-10 md:mt-0">
            <button type="button" class="button-arrow previous" on:click="{() => { if (currentStep > 0) currentStep--; }}">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 15.75L3 12m0 0l3.75-3.75M3 12h18" />
              </svg>
            </button>

            <div class="flex items-center gap-1 mx-4">
              <div class="min-w-[12px] w-3 h-3 rounded-full bg-[#525252]"></div>
              <div class="min-w-[12px] w-3 h-3 rounded-full bg-[#525252]"></div>
              <div class="min-w-[12px] w-5 h-5 rounded-full bg-white"></div>
            </div>

            <button type="submit" class="button-arrow next" class:primary={question3 !== ''} class:!hidden={currentStep === totalSteps}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
              </svg>
            </button>
          </div>
        </div>
      {/if}
    </form>
  </div>
  <div class="col-span-2 relative card flex flex-col">
    {#if packageType}
      <img src={PackImage} class="absolute bottom-0 w-full h-full object-contain object-bottom opacity-25" alt="pack" />

      <div class="relative z-10 flex flex-col space-y-3">
        <p>Op basis van jouw voorkeuren:</p>
        <h5 class="text-3xl">{packageType}</h5>
        
        <p>
          {#if packageType === 'Starter Pack'}
            2
            {:else if packageType === 'Performance Pack'}
            3
            {:else if packageType === 'Champion Pack'}
            6
          {/if}overgrips<br>
          {#if packageType === 'Starter Pack'}
            1
            {:else if packageType === 'Performance Pack'}
            2
            {:else if packageType === 'Champion Pack'}
            4
          {/if}blik padelballen (3 stuks)          
        </p>
        <button class="button button-primary" on:click={addToCart}>Winkelmand</button>
      </div>

      {:else}
        <p class="text-2xl">Beantwoord de vragen & kom erachter welk pakket bij jou past!</p>
    {/if}
  </div>
</div>

<style>
  .card {
    @apply flex flex-col bg-gradient-to-r from-[#16191B] to-[#090B0C] pt-12 px-4 pb-6;
  }
  h4 {
    @apply text-base font-bold mb-4;
  }
  h4 span {
    @apply text-primary;
  }
  .button-arrow {
    @apply flex justify-center items-center w-14 h-14 rounded-full border border-white opacity-50;
  }
  .button-arrow.next {
    @apply pointer-events-none;
  }
  .button-arrow.primary {
    @apply bg-primary border-primary text-black opacity-100 pointer-events-auto;
  }
  .finish {
    @apply bg-green-400 border-green-400 !opacity-100;
  }
  .select {
    @apply inset-0 w-full rounded-full border border-white peer-checked:border-primary py-2 px-6;
  }
</style>
 