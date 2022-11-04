import express from 'express';
import cors from 'cors';
import { usersList } from '../constants/userMock.js';
import { tweetList } from '../constants/tweetMock.js';

const TWEETS_TO_SHOW = 10;
const TWEETS_PER_PAGE = 10;

const app = express();
app.use(cors());
app.use(express.json());

const parseTweet = function (tweet) {
  const tweetUser = usersList.find((u) => u.username === tweet.username);
  return { ...tweet, avatar: tweetUser.avatar };
};

const parseLastTweets = function (numberTweets = Infinity) {
  const lastTweets =
    tweetList.length > numberTweets
      ? tweetList.slice(0, numberTweets)
      : [...tweetList];
  const tweetsPosts = lastTweets.map((tweet) => parseTweet(tweet));
  return tweetsPosts;
};

const parsePageTweets = function (page) {
  const firsTweetIndex = TWEETS_PER_PAGE * (page - 1);
  const lastTweetIndex = firsTweetIndex + TWEETS_PER_PAGE;
  const pageTweets = tweetList.slice(firsTweetIndex, lastTweetIndex);
  const tweetsPagePosts = pageTweets.map((tweet) => parseTweet(tweet));
  return tweetsPagePosts;
};

const filterUserTweets = function (username, numberTweets = Infinity) {
  const userTweets = tweetList.filter((tweet) => tweet.username === username);
  const lastUserTweets =
    userTweets.length > numberTweets
      ? userTweets.slice(0, numberTweets)
      : [...userTweets];
  const userTweetsPost = lastUserTweets.map((tweet) => parseTweet(tweet));
  return userTweetsPost;
};

app.post('/sing-up', (req, res) => {
  const { username, avatar } = req.body;
  usersList.push({ username, avatar });
  res.status(200).send('Ok');
});

app.get('/tweets', (req, res) => {
  if (req.query.page) {
    const page = parseInt(req.query.page);
    page > 0
      ? res.send(parsePageTweets(page))
      : res.status(400).send('Informe uma página válida!');
  } else {
    res.send(parseLastTweets(TWEETS_TO_SHOW));
  }
});

app.get('/tweets/:username', (req, res) => {
  const username = req.params.username;
  res.send(filterUserTweets(username, TWEETS_TO_SHOW));
});

app.listen(5000, () => console.log('Server running in port 5000...'));
