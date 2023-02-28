const tmi = require('tmi.js');
const fs = require('fs');
require('dotenv').config();

// Define configuration options
const opts = {
    identity: {
        username: process.env.BOT_USERNAME,
        password: process.env.BOT_TOKEN
    },
    channels: ['theprimeagen', 'teej_dv', 'bashbunni', 'roxcodes']
};

let exiting = false;

// Create a client with our options
const client = new tmi.client(opts);

// Register our event handlers (defined below)
client.on('message', onMessageHandler);
client.on('connected', onConnectedHandler);

let stream = {};

try {
    stream = JSON.parse(
        fs.readFileSync('./dirtyData.json', {
            encoding: 'utf8'
        })
    );
} catch (e) {
    console.log(e);
}

for (let i = 0; i < opts.channels.length; i++) {
    if (!stream[opts.channels[i]]) {
        stream[opts.channels[i]] = {
            users: new Map()
        };
    } else {
        stream[opts.channels[i]] = {
            users: new Map(Object.entries(stream[opts.channels[i]].users))
        };
    }
}

// Connect to Twitch:
client.connect();

// Called every time a message comes in
function onMessageHandler(target, context, msg, self) {
    if (self || msg.startsWith('!')) {
        return;
    } // Ignore messages from the bot

    const { username } = context;
    console.log('.');

    const userMap = stream[target].users;

    if (!userMap.has(username)) {
        userMap.set(username, { context, messages: [msg] });
    } else {
        userMap.get(username).messages.push(msg);
    }
}

// Called every time the bot connects to Twitch chat
function onConnectedHandler(addr, port) {
    console.log(`* Connected to ${addr}:${port}`);
}

function handleExit() {
    if (exiting) return;

    exiting = true;

    for (let i = 0; i < opts.channels.length; i++) {
        console.log(opts.channels[i]);

        stream[opts.channels[i]] = {
            users: Object.fromEntries(stream[opts.channels[i]].users),
            messages: stream[opts.channels[i]].messages
        };
    }

    fs.writeFileSync('./dirtyData.json', JSON.stringify(stream), (err) => {
        if (err) console.log('Error writing file:', err);
    });
    if (process.exit) process.exit();
}

//process.on('exit', handleExit.bind(null));
process.on('SIGINT', handleExit.bind(null));
process.on('uncaughtException', handleExit.bind(null));
