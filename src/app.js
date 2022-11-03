import express from 'express';
import { usersList } from '../constants/userMock.js';
import { tweetList } from '../constants/tweetMock.js';

const TWEETS_TO_SHOW = 10;

const app = express();

const parseTweet = function(tweet){
  const tweetUser = usersList.find(u => u.username === tweet.username);
  return {...tweet, avatar: tweetUser.avatar};    
};

const parseLastTweets = function (numberTweets = TWEETS_TO_SHOW) {
  const lastTweets = tweetList.length > numberTweets ? tweetList.slice(0,numberTweets): [...tweetList];
  const tweetsPosts = lastTweets.map(tweet =>parseTweet(tweet));
  return tweetsPosts;
};

app.get('/tweets',(req,res)=>{
  console.log(parseLastTweets());
  res.send(parseLastTweets());
});

app.listen(5000, () => console.log('Server running at port 5000...'));
