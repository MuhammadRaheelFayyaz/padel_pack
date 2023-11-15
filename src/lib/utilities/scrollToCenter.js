import { writable } from 'svelte/store';

function createScrollStore() {
    const { subscribe, set } = writable(null);

    return {
        subscribe,
        scrollTo: (targetId) => {
            const target = document.querySelector(targetId);
            if (target) {
                const targetPosition = target.getBoundingClientRect().top;
                const offset = window.innerHeight / 2;
                const scrollToPosition = window.scrollY + targetPosition - offset;
                window.scrollTo({
                    top: scrollToPosition,
                    behavior: "smooth"
                });
            }
        }
    };
}

const scrollToCenterStore = createScrollStore();

export default scrollToCenterStore;