<script lang="ts">
    import { onMount } from 'svelte';
    import { page } from '$app/stores';
    import Modal from '$lib/Modal.svelte';

    let stream: string;

    let messages: { message: string }[] = [];
    let guesses: string[] = [];
    let guessMatchs: string[] = [];

    $: lastGuessMatch = guessMatchs[0];

    let input = '';
    let inputElement: HTMLInputElement;
    let inputFocused = false;

    let chatter: number;

    let gaveUp: boolean | undefined;

    const Lgifs = [
        'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExYTY4YzM5ZTE1NDFjMzJiNWFkMDVhNGI3NTA5ZDEwZTgzOWQzYmZmOCZjdD1n/YOUsVM7ibNtB1jsnJh/giphy-downsized-large.gif',
        'https://media.giphy.com/media/PmpOmLzMPb3W1H1dor/giphy-downsized-large.gif',
        'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExYTdhNmQ1NTlmNDI2OTBmMTUxODJlNmM5OTBiNjM2MDMxM2VhMDJhOCZjdD1n/VwYHKsBaMRlyyJpoXD/giphy.gif',
        'https://media.giphy.com/media/glHjkjvp8yA0lXi3Nx/giphy.gif',
        'https://media.giphy.com/media/RcCSH63kZ6gbvFYZVT/giphy.gif',
        'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNDljNDFkMjVhZTYyOTdlYTRiYzZlMjQ3MmRlNWFhZjNjNGY4OTc3MyZjdD1n/TQesavVV5gWerCW1IT/giphy.gif',
        'https://media.giphy.com/media/C5y6jShYRtb2M/giphy.gif',
        'https://media.giphy.com/media/xUySTZs1ovJygetpYs/giphy.gif',
        'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExOTI1ZjQ0ZmYwMjM1MGZjOTk5NTg0NzY0ZWRkZmFkZTlmZDg2Yjk1ZiZjdD1n/l1AvAFNrTyM0dnwqs/giphy.gif',
        'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExOTI1ZjQ0ZmYwMjM1MGZjOTk5NTg0NzY0ZWRkZmFkZTlmZDg2Yjk1ZiZjdD1n/l1AvAFNrTyM0dnwqs/giphy.gif'
    ];

    const Wgifs = [
        'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExY2JlMzUxMjBiZjYzMjkwMWUxMzg0ZmFkY2VkYjJiODVkMTM1ZmVlZiZjdD1n/IfNk3i4219EzTSbxCr/giphy.gif',
        'https://media.giphy.com/media/jyd3prqhbt0LEKVZ6l/giphy-downsized-large.gif',
        'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExZjk4YzdjMWIxMjQxODY5NjA0YjQ3MDgwODY5NTFkZWNjNDdiMGJmYiZjdD1n/iKBBokzokXjuqfWKf5/giphy.gif',
        'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExOWQ3ZmZkOTlmNzc2MTkzZjEwNjNkYjNhMDQ0ZTgyNWRiMmQxZTc5NSZjdD1n/l3J49hMwpCma1lasBB/giphy.gif',
        'https://media.giphy.com/media/5sjEoGaXPn8AHVO6TY/giphy.gif',
        'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExMDE3OWZhMmQ2MzBmYzE0NmIyZDNjOTY2YWMyOWZkMGVhYzdhMGEwYyZjdD1n/xUPGckJaAwibkfSCkg/giphy.gif',
        'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNWQ2ZjFmNjBlNzkzZTczZThiYjM0OTgwNDU4ZGIzNjc3Nzg3ZmU5NyZjdD1n/KcoMbJQRBj9GuXhCNp/giphy.gif',
        'https://media.giphy.com/media/jzaZ23z45UxK8/giphy.gif',
        'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExZjJhNmY5MDNjZjI1NDdlYmU5MWYwM2Y2MzU4ODE1ODBjYzRlOTBhNyZjdD1n/3o6wNKjI7XkipBHUjK/giphy.gif',
        'https://media.giphy.com/media/WBhdSWC6RMG95D5DBI/giphy.gif',
        'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExZDAyMDM2MGM4NDdkNGQwZTZiODQxYjY1ODkzZGI2NmMyNjQ5ZTZkYSZjdD1n/eN4masMUHjy3d3OHrh/giphy-downsized-large.gif'
    ];

    $: showModal = (() => {
        if (!lastGuessMatch) {
            return false;
        }

        for (let i = 0; i < lastGuessMatch.length; i++) {
            if (lastGuessMatch[i] != '1') {
                return false;
            }
        }

        chatter += 1;
        localStorage.setItem('chatter', String(chatter));
        gaveUp = false;
        return true;
    })();

    $: {
        if (guesses.length > 0 && guesses[0].trim().startsWith(':q')) {
            chatter += 1;
            localStorage.setItem('chatter', String(chatter));
            gaveUp = true;
            showModal = true;
        }
    }

    const addGuess = async () => {
        if (input.length === 0) {
            return;
        }

        let params = new URLSearchParams();

        params.append('stream', stream);
        params.append('guess', input);
        params.append('chatter', String(chatter));

        let guessMatch = (await (await fetch(`/api?${params.toString()}`)).json()).hint;

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

    const getNewUser = async () => {
        let params = new URLSearchParams();

        params.append('stream', stream);
        params.append('guess', input);
        params.append('chatter', String(chatter));

        const data = await (await fetch(`/api?${params.toString()}`)).json();
        if (data.messages) {
            messages = data.messages.reverse();
        }
        guessMatchs = [data.hint];
        guesses = [new Array(guessMatchs[0].length + 1).join(' ')];
        showModal = false;
        gaveUp = undefined;
    };

    const getRandomInt = (min: number, max: number) => {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min) + min);
    };

    const getGif = (gifs: string[]) => {
        return gifs[getRandomInt(0, gifs.length)];
    };

    onMount(async () => {
        stream = $page.url.searchParams.get('stream') || '';

        console.log($page.url.searchParams.get('stream'))
        console.log(stream)

        let storedChatter = localStorage.getItem('chatter');
        if (storedChatter) {
            chatter = Number(storedChatter);
        } else {
            chatter = 0;
            localStorage.setItem('chatter', String(0));
        }

        await getNewUser();
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
            {#each messages.slice(-Math.min(messages.length, guesses.length)) as message}
                <div class="flex m-5 my-1">
                    <div class="min-w-[10px] bg-purple-500 mr-2" />
                    <p>{message}</p>
                </div>
            {/each}
        </div>
    </div>
</div>

<Modal bind:showModal>
    <div class="flex flex-col">
        <img alt="gif" src={gaveUp != undefined ? (gaveUp ? getGif(Lgifs) : getGif(Wgifs)) : ''} />
        <h1 class="text-xl font-bold">
            {#if gaveUp}
                wow... ok
            {/if}
        </h1>
        <div class="my-5">
            <h2 class="text-5xl text-center">
                {#if gaveUp}
                    guess we'll never know
                {:else}
                    {guesses[0]}
                {/if}
            </h2>
            <p>
                guesses: {guesses.length - 1}
            </p>
        </div>
        <button on:click={getNewUser} class="rounded-md bg-purple-500 p-2 text-white">
            play again
        </button>
    </div>
</Modal>
