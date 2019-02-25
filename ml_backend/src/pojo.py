class TweetAuthor:
  def __init__(self, username, location, followers):
    self.username = username
    self.location = location
    self.followers = followers


class Tweet:
    def __init__(self, text, timestamp, tweet_id, language, retweets, favourites, author):
    self.text = text
    self.timestamp = timestamp
    self.tweet_id = tweet_id
    self.language = language
    self.retweets = retweets
    self.favourites = favourites
    self.author = author

  def get_dict_object(self):
    return {
      "text": self.text,
      "timestamp": self.timestamp,
        "tweetId": self.tweet_id,
      "language": self.language,
      "retweets": self.retweets,
      "favourites": self.favourites,
      "author": {
        "username": self.author.username,
        "location": self.author.location,
        "followers": self.author.followers
      }


    }


def get_author_object_from_dict(author_dict):
    return TweetAuthor(author_dict["username"], author_dict["location"], author_dict["followers"])


def get_tweet_object_from_dict(tweet_dict):
    return Tweet(tweet_dict["text"], tweet_dict["timestamp"], tweet_dict["id_str"], tweet_dict["language"],
                 tweet_dict["retweets"], tweet_dict["favourites"], get_author_object_from_dict(tweet_dict["author"]))
