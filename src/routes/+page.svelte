<script lang="ts">
    const streams = ['theprimeagen', 'teej_dv', 'bashbunni', 'roxcodes'];
    const gifs: Record<string, string> = {
        theprimeagen:
            'https://i.pinimg.com/originals/3d/45/68/3d456807df9af3c64feb753cd9de7a61.gif',
        teej_dv:
            'https://i.ytimg.com/vi/EdNBHsSL2mw/hqdefault.jpg?sqp=-oaymwE9CNACELwBSFryq4qpAy8IARUAAAAAGAElAADIQj0AgKJDeAHwAQH4Af4JgALQBYoCDAgAEAEYSiBlKEcwDw==&rs=AOn4CLB9uIRY4-jjgzOlAsDrEhBy9oET3w',
        bashbunni:
            'https://clips-media-assets2.twitch.tv/e5c7Upni9mbdkbY1v-o_wg/41730575755-offset-644-preview-480x272.jpg',
        roxcodes:
            'https://pbs.twimg.com/media/EraJgX-U0AAOcb2.png'
    };
    const cow = 'https://media.giphy.com/media/9J5iGIlq0QeLXU1bQB/giphy.gif';
    let gif = cow;
</script>

<div class="flex items-center justify-center h-screen">
    <div class="w-1/3 bg-orange-100 ml-5 rounded-md">
        <div class="h-full flex p-5 flex-col items-center">
            <h1 class="text-5xl font-bold my-5">topchatter</h1>

            <img alt="img" src={gif} class="h-40" />

            <h2 class="w-content text-xl font-bold mb-5">choose stream</h2>

            {#each streams as stream}
                <a
                    href="/play?stream={stream}"
                    class="w-min text-purple-500
                hover:text-white"
                    on:mouseenter={() => {
                        gif = gifs[stream];
                    }}
                    on:mouseleave={() => {
                        gif = cow;
                    }}
                >
                    <div class="flex w-min">
                        {#each stream as char}
                            <span
                                class="basis-1/{'theprimeagen'.length}
                            text-center w-[2ch]
                            ml-1 my-2 bg-purple-500
                            rounded-md">{char}</span
                            >
                        {/each}
                    </div>
                </a>
            {/each}
        </div>
    </div>
</div>
