<script>
	export let error;
	export let id = null;
	export let label;
	export let options = [];
	export let type = 'text';
	export let value;
    export let checked = false;

	const inputType = (() => {
		if (type === 'textarea') {
			return 'textarea';
		}
		if (type === 'select') {
			return 'select';
		}

		return 'input';
	})();

	function handleInput({ target }) {
		error = null;
		value = target.value;
	}

	function handleChange({ target }) {
		error = null;
		value = target.value;
	}
</script>

<div class="form-group">
    {#if type === 'toggle'}
        <div class="flex items-center gap-4">
            <span>{label}</span>
            <div class="toggle">
                <input 
                    type="checkbox"
                    class="peer"
                    class:error
                    {id}
                    {value}
                    {...$$restProps}
                    {checked}
                    on:change
                    on:change={handleChange}
                    on:click
                    on:input
                    on:input={handleInput}
                />
                <div class="toggle--bg peer-checked:bg-green-500" />
                <span class="peer-checked:translate-x-5 duration-200 pointer-events-none" />
            </div>
        </div>

        {:else}
            {#if label && type !== 'checkbox'}
                <label class="form-label" for={id}>{@html label}</label>
            {/if}
            <svelte:element
                this={inputType}
                class="input"
                class:checkbox={type === 'checkbox'}
                class:error
                {id}
                {type}
                {value}
                {...$$restProps}
                on:change
                on:change={handleChange}
                on:click
                on:input
                on:input={handleInput}
            >
                {#each options as option, index}
                    <option value={option.value} selected={index === 0}>{option.label}</option>
                {/each}
            </svelte:element>
    {/if}
	

	{#if label && type === 'checkbox'}
		<label class="form-label !inline" for={id}>{@html label}</label>
	{/if}
	
	{#if error}
		<p class="form-error">{error}</p>
	{/if}
</div>

<style>
	.error {
		@apply border-red-500;
	}
	p.form-error {
		@apply text-xs mt-1 text-red-500;
	}
    .checkbox {
        @apply w-auto h-auto border-theme-dark-blue/20 inline-block;
    }
    .form-group {
        @apply w-full;
    }
</style>