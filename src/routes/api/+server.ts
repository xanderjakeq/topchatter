import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET = (({ url, fetch }) => {
    const guess = url.searchParams.get('guess');

    // TODO: fetch random user
    let username = 'xanderjakeq';

    if (!guess) {
        return json(
            { hint: new Array(username.length + 1).join("_") },
            {
                status: 400
            }
        );
    }


    let guessHint = '';
    for (let i = 0; i < username.length; i++) {
        console.log(username[i], guess[i]);
        if (username[i] === guess[i]) {
            guessHint = guessHint + "1";
        } else if (username.includes(guess[i])) {
            guessHint = guessHint + "0";
        } else {
            guessHint = guessHint + '_';
        }
    }

    return json({ hint: guessHint });
}) satisfies RequestHandler;
