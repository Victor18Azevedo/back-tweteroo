import express from 'express';
import { usersList } from '../constants/userMock.js';
import { tweetList } from '../constants/tweetMock.js';

const TWEETS_TO_SHOW = 10;

const app = express();

const parseTweet = function(tweet){
  const tweetUser = usersList.find(u => u.username === tweet.username);
  return {...tweet, avatar: tweetUser.avatar};    
};

const parseLastTweets = function (numberTweets = Infinity) {
  const lastTweets = tweetList.length > numberTweets ? tweetList.slice(0,numberTweets): [...tweetList];
  const tweetsPosts = lastTweets.map(tweet =>parseTweet(tweet));
  return tweetsPosts;
};

const filterUserTweet = function (username, numberTweets = Infinity) {
  const userTweets = tweetList.filter(tweet => tweet.username === username);
  const lastUserTweets = userTweets.length > numberTweets ? userTweets.slice(0,numberTweets): [...userTweets];
  const userTweetsPost = lastUserTweets.map(tweet =>parseTweet(tweet));
  return userTweetsPost;
};

app.get('/tweets',(req,res)=>{
  console.log(parseLastTweets(TWEETS_TO_SHOW));
  res.send(parseLastTweets(TWEETS_TO_SHOW));
});

app.get('/tweets/:username',(req,res)=>{
  const username = req.params.username;
  res.send(filterUserTweet(username, TWEETS_TO_SHOW));
});

app.listen(5000, () => console.log('Server running at port 5000...'));
