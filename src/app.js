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
  if (!username || !avatar) {
    res.status(400).send('Todos os campos são obrigatórios!');
    return;
  }

  usersList.push({ username, avatar });
  res.status(201).send('Ok');
});

app.post('/tweets', (req, res) => {
  const { username, tweet } = req.body;
  if (!username || !tweet) {
    res.status(400).send('Todos os campos são obrigatórios!');
    return;
  }

  tweetList.unshift({ username, tweet });
  res.status(201).send('Ok');
});

app.get('/tweets', (req, res) => {
  const { page } = req.query;
  if (page) {
    page > 0
      ? res.send(parsePageTweets(page))
      : res.status(400).send('Informe uma página válida!');
    return;
  }

  res.send(parseLastTweets(TWEETS_TO_SHOW));
});

app.get('/tweets/:username', (req, res) => {
  const username = req.params.username;

  if (usersList.filter((u) => u.username === username).length === 0) {
    res.status(400).send('Usuário inexistente');
    return;
  }

  const userTweets = filterUserTweets(username, TWEETS_TO_SHOW);
  if (userTweets.length === 0) {
    res.status(400).send('Usuário sem tweets');
    return;
  }

  res.send(userTweets);
});

app.listen(5000, () => console.log('Server running in port 5000...'));
