<script lang="ts">
    import messages from '$lib/MOCK_DATA.json';

    let guesses: string[] = [];

    let input = '';

    let username = 'xanderjakeq';

    const addGuess = () => {
        let paddedGuess = input;
        if (paddedGuess.length <= username.length) {
            paddedGuess =
                paddedGuess + new Array(1 + username.length - paddedGuess.length).join(' ');
        }
        guesses.unshift(paddedGuess);
        guesses = guesses;
        input = '';
    };

    $: {
        if (input.length >= username.length) {
            input = input.slice(0, username.length);
        }
    }
</script>

<div class="flex flex-col items-center justify-center h-screen p-5">
    <div class="h-full w-full px-10 flex overflow-hidden">
        <div class="bg-slate-50 w-80 h-40">
            <h1>topchatter</h1>
            <p>
                Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation
            </p>

            test

            <div class="w-80 h-40 my-5" />
        </div>

        <div class="w-full h-full flex flex-col px-5 ">
            <div class="flex h-3/5">
                <div class="basis-3/4 w-40 h-full text-[1.7rem]">
                    <div
                        class="bg-yellow-100 h-full border-2 border-sky-500
                    relative flex flex-col"
                    >
                        <div class="h-full overflow-y-scroll flex flex-col-reverse">
                            {#each guesses as guess}
                                <div class="flex w-full flex-wrap">
                                    {#each guess as char, i}
                                        <span
                                            class="basis-1/25 text-center w-[2ch]
                                        ml-1 my-2 {username.includes(char)
                                                ? username[i] === char
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
                        <form class="bg-white h-10" on:submit|preventDefault={addGuess}>
                            <input
                                bind:value={input}
                                placeholder="take a guess"
                                type="text"
                                class="w-full h-full"
                            />
                        </form>
                    </div>
                </div>
                <div
                    class="basis-1/4 bg-orange-100 w-full h-full border-2
                border-sky-500 ml-5"
                >
                    <div
                        class="w-full h-full flex flex-col-reverse py-5
                        overflow-y-scroll "
                    >
                        {#each messages as message}
                            <div class="flex m-5 my-1">
                                <div class="min-w-[10px] bg-purple-500 mr-2" />
                                <p>{message.message}</p>
                            </div>
                        {/each}
                    </div>
                </div>
            </div>

            <div class="flex h-2/5 w-full justify-between py-5">
                <div class="bg-slate-50 w-80 h-full">test</div>

                <div class="bg-slate-50 w-80 h-full">test</div>
                <div class="bg-slate-50 w-80 h-full">test</div>
            </div>
        </div>
    </div>
</div>
