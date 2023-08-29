# topchatter

A game for streamers to guess their top chatters.

## developing

Once you've created a project and installed dependencies with `npm install` (or
`pnpm install` or `yarn`), start a development server:
```bash
pnpm i
pnpm dev
```

## data collection

run the bot to listen to twitch stream chats
```bash
node src/bot.cjs
```

stop the script to save, then:
```bash
node src/cleanup.cjs
```

`data.json` should be updated and ready to be played.

## building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an
> [adapter](https://kit.svelte.dev/docs/adapters) for your target environment.
