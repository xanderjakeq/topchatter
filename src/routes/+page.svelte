<script lang="ts">
    import messages from '$lib/MOCK_DATA.json';
    import { onMount } from 'svelte';

    export let data;

    let guesses: string[] = [];
    let guessMatchs: string[] = [];

    $: lastGuessMatch = guessMatchs[0];

    let input = '';
    let inputElement: HTMLInputElement;
    let inputFocused = false;

    const addGuess = async () => {
        let guessMatch = (await (await fetch(`/api?guess=${input}`)).json()).hint;

        let paddedGuess = input;
        if (paddedGuess.length <= guessMatch.length) {
            paddedGuess =
                paddedGuess + new Array(1 + guessMatch.length - paddedGuess.length).join(' ');
        }
        guessMatchs.unshift(guessMatch);
        guessMatchs = guessMatchs;
        guesses.unshift(paddedGuess);
        guesses = guesses;
        input = '';
    };

    $: {
        input = input.replace(/\s/g, '');
        if (lastGuessMatch && input.length >= lastGuessMatch.length) {
            input = input.slice(0, lastGuessMatch.length);
        }
    }

    onMount(async () => {
        guessMatchs = [(await (await fetch(`/api?guess=${input}`)).json()).hint];
        guesses = [new Array(guessMatchs[0].length + 1).join(' ')];
    });
</script>

<div class="flex items-center justify-center h-screen">
    <div class="h-5/6 text-[1.7rem]">
        <div class="bg-yellow-100 h-full flex flex-col rounded-md">
            <div class="h-full overflow-y-scroll flex flex-col-reverse  pr-1">
                {#each guesses as guess, i}
                    <div class="flex w-min">
                        {#each guess as char, j}
                            <span
                                class="basis-1/{lastGuessMatch.length} text-center w-[2ch]
                                        ml-1 my-2 {guessMatchs[i][j] != '_'
                                    ? guessMatchs[i][j] === '1'
                                        ? 'bg-green-500'
                                        : 'bg-yellow-500'
                                    : 'bg-gray-400'}
                                            rounded-md
                                            ">{char}</span
                            >
                        {/each}
                    </div>
                {/each}
            </div>
            <button
                on:click={() => {
                    inputElement.focus();
                    inputFocused = true;
                    inputElement.addEventListener('blur', () => {
                        inputFocused = false;
                    });
                }}
                class="bg-white h-20 rounded-md outline-0 {input.length > 0
                    ? 'text-white'
                    : 'text-gray-600'} {inputFocused ? 'bg-blue-100' : ''}"
            >
                <div class="flex w-min">
                    {#each input as char, j}
                        <span
                            class="basis-1/{lastGuessMatch.length}
                            text-center w-[2ch]
                            ml-1 my-2 bg-purple-500
                            rounded-md">{char}</span
                        >
                    {/each}
                </div>
                {inputFocused || input.length > 0 ? '' : 'take a guess'}
            </button>

            <form class="h-[0]" on:submit|preventDefault={addGuess}>
                <input
                    bind:this={inputElement}
                    size={lastGuessMatch?.length}
                    bind:value={input}
                    placeholder="take a guess"
                    type="text"
                    class="opacity-0 outline-0"
                />
            </form>
        </div>
    </div>
    <div class="w-1/3 bg-orange-100 h-5/6 ml-5 rounded-md">
        <div
            class="h-full flex flex-col-reverse py-5
                        overflow-y-scroll "
        >
            {#each messages as message}
                <div class="flex m-5 my-1">
                    <div class="min-w-[10px] bg-purple-900 mr-2" />
                    <p>{message.message}</p>
                </div>
            {/each}
        </div>
    </div>
</div>
