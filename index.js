const _ = require('lodash');
const fs = require('fs');
const Twit = require('twit-promise');

function Bot(run) {
  this.runFunc = run;
  const self = this;
  process.stdin.on('readable', () => {
    const initData = JSON.parse(process.stdin.read());
    self.params = initData.params;
    self.twit = new Twit(initData.twit);
    self.runFunc().then(() => self.log('kill')).catch(err => self.log({error: err.message}));
  });
}

Bot.prototype.log = function (log) {
  const message = {
    content: log,
    date: new Date()
  }
  process.stdout.write(JSON.stringify(message) + '\n');
}

Bot.prototype.tweet = function (tweetData) {
  const self = this;

  function postTweet(params) {
    self.log('posting tweet');
    return self.twit.post('statuses/update', params).then(result => {
      if (result.data.errors) {
        throw new Error(JSON.stringify(result.data.errors[0]))
      } else {
        self.log('tweet posted successfully')
        self.log({tweet: result});
      }
    }).catch(err =>  {
      self.log({error: err.message})
    });
  }

  if (tweetData.media) {
    self.log('uploading media');
    return self.twit.post('media/upload', {
      media_data: tweetData.media
    }).then(result => {
      tweetData.mediaIdStr = result.data.media_id_string;
      const meta_params = {
        media_id: tweetData.mediaIdStr,
        alt_text: {
          text: tweetData.altText || 'none'
        }
      }
      return self.twit.post('media/metadata/create', meta_params);
    }).then(() => {
      const params = {
        status: tweetData.status,
        media_ids: [tweetData.mediaIdStr]
      };
      return params;
    }).then(postTweet);
  } else
    return postTweet(tweetData);
}

Bot.prototype.get = function (getUrl, getData) {
  return this.twit.get(getUrl, getData);
}

module.exports = Bot
