const fs = require('fs');
require('dotenv').config();

fs.readFile('./dirtyData.json', 'utf8', (err, jsonString) => {
    if (err) {
        console.log('File read failed:', err);
        return;
    }
    const data = JSON.parse(jsonString);
    const streams = Object.keys(data);

    for (let i = 0; i < streams.length; i++) {
        const stream = data[streams[i]];
        const users = stream.users
        const usernames = Object.keys(users);

        usernames.sort((a, b) => {

            if (users[a].messages.length < users[b].messages.length) {
                return 1;
            }

            if (users[a].messages.length > users[b].messages.length) {
                return -1;
            }

            return 0;
        });


        stream.sortedUsers = usernames;
    }

    fs.writeFileSync('./data.json', JSON.stringify(data), (err) => {
        if (err) console.log('Error writing file:', err);
    });

    console.log("cleanup done");
});
