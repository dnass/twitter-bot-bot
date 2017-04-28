# twitter-bot-bot

A Node package for building promise-based Twitter bots that can be deployed with [bot-server](https://github.com/dnass/bot-server).

## Installation

`npm install twitter-bot-bot --save`

## Using twitter-bot-bot

### Creating your bot

`var Tbb = require('twitter-bot-bot')`

Initialize the bot by passing the constructor a function containing all of the bot's logic, which returns a promise or promise chain. For example:

```
function run() {
  loadTweets().then(downloadImages).then(postTweet)
}

var bot = new Tbb(run)
```

twitter-bot-bot and bot-server take care of error handling, so no `catch` needed.

twitter-bot-bot bots run as child processes of bot-server. For console output, write to `bot.log`.

To post a tweet, use `bot.tweet`. `bot.tweet` takes an object with a `status` value and optional `media` and `altText` values. `media` must be a base64-encoded image. `bot.tweet` returns a promise that resolves to Twitter's response.

### Setting up your bot's package

Bots built with twitter-bot-bot run on [bot-server](https://github.com/dnass/bot-server). To add parameters to your bot that can be configured from the server (such as API keys), add a `botConfig` object to your bot's `package.json` with a `params` array containing the names of the parameters.

```
botConfig: {
  params: ['NASA_API_KEY']
}
```

You can then access this from your code as `bot.params.NASA_API_KEY`.

The `botConfig` object should also contain a `handle` key with the handle of your Twitter bot's associated account.

### Deploying your bot

twitter-bot-bot bots _only_ run on bot-server. For instructions on how to set up a server to run your bot, check out [bot-server](https://github.com/dnass/bot-server).
