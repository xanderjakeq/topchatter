import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

import streams from '../../../data.json';

type Stream = {
    users: Record<
        string,
        {
            context: Record<string, any>;
            messages: string[];
        }
    >;
    sortedUsers: string[];
};

export const GET = (({ url }) => {
    const stream = url.searchParams.get('stream');

    if (!stream) return json({ message: "who's stream??" }, { status: 400 });

    const guess = url.searchParams.get('guess');
    const chatter = Number(url.searchParams.get('chatter')) || 0;

    const { users, sortedUsers } = (streams as Record<string, Stream>)[`#${stream}`];
    const username = sortedUsers[chatter];
    const { messages, context } = users[username];

    if (!guess) {
        return json(
            { hint: new Array(username.length + 1).join('_'), messages, context },
            {
                status: 400
            }
        );
    }

    const countMap = new Map();

    for (let i = 0; i < username.length; i++) {
        const char = username[i];
        if (countMap.has(char)) {
            countMap.set(char, countMap.get(char) + 1);
        } else {
            countMap.set(char, 1);
        }
    }

    let guessHint = '';
    for (let i = 0; i < username.length; i++) {
        const count = countMap.get(guess[i]);
        const guessChar = guess[i];

        if (username[i] === guessChar && count > 0) {
            guessHint = guessHint + '1';
        } else if (username.includes(guessChar)) {
            if (count <= 0) {
                guessHint = guessHint + '_';
                continue;
            }
            guessHint = guessHint + '0';
        } else {
            guessHint = guessHint + '_';
        }

        if (username.includes(guessChar)) {
            countMap.set(guessChar, countMap.get(guessChar) - 1);
        }
    }

    return json({ hint: guessHint });
}) satisfies RequestHandler;
