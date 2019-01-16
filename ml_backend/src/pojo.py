class TweetAuthor:
    def __init__(self, username, location, followers):
        self.username = username
        self.location = location
        self.followers = followers


class Tweet:
    def __init__(self, text, timestamp, id, language, retweets, favourites, author):
        self.text = text
        self.timestamp = timestamp
        self.id = id
        self.language = language
        self.retweets = retweets
        self.favourites = favourites
        self.author = author

    def get_dict_object(self):
        return {
            "text": self.text,
            "timestamp": self.timestamp,
            "id": self.id,
            "language": self.language,
            "retweets": self.retweets,
            "favourites": self.favourites,
            "author": {
                "username": self.author.username,
                "location": self.author.location,
                "followers": self.author.followers
            }

        }
