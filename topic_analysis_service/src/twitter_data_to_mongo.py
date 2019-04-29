import json
import requests
from dateutil.parser import parser
from pymongo import MongoClient
from requests_oauthlib import OAuth1

from pojo import TweetAuthor, Tweet

CONFIG_JSON_FILE_NAME = "../config.json"

SOURCES_JSON_FILE_NAME = "../sources.json"
TWITTER_KEY = "twitter"
ACCOUNTS_KEY = "accounts"
WORDS_KEY = "words"

TWITTER_API_BASE_URL = "https://api.twitter.com/1.1/"
TWITTER_API_SEARCH_URL = TWITTER_API_BASE_URL + "search/tweets.json"
TWITTER_API_AUTH_URL = "https://api.twitter.com/oauth2/token"
TWITTER_ENV_NAME = "dev"
TWITTER_API_HASHTAG_URL = "https://api.twitter.com/1.1/tweets/search/30day/%s.json?" % TWITTER_ENV_NAME


# TODO - Test
# TODO - Rename
def get_twitter_accounts(sources_json):
    accounts = []

    for source in sources_json:
        if source['platform'] == 'twitter' and source['valueType'] == 'account':
            accounts.append(source['value'])

    return accounts


# TODO - Test
# TODO - Rename
def get_twitter_search_words(sources_json):
    words = []

    for source in sources_json:
        if source['platform'] == 'twitter' and source['valueType'] == 'word':
            words.append(source['value'])

    return words


# TODO - Test
# TODO - Rename
def get_twitter_hashtags(sources_json):
    hashtags = []

    for source in sources_json:
        if source['platform'] == 'twitter' and source['valueType'] == 'hashtag':
            hashtags.append(source['value'])

    return hashtags


# TODO - Test
def get_twitter_account_timeline_url():
    return TWITTER_API_BASE_URL + "statuses/user_timeline.json"


def get_twitter_keys(config):
    return config["keys"][TWITTER_KEY]


def get_twitter_access_token(twitter_keys):
    return twitter_keys["accessToken"]


def get_twitter_consumer(twitter_keys):
    return twitter_keys["consumer"]


def get_twitter_auth(twitter_keys):
    return OAuth1(get_twitter_consumer(twitter_keys)["key"],
                  get_twitter_consumer(twitter_keys)["secret"],
                  get_twitter_access_token(twitter_keys)["token"],
                  get_twitter_access_token(twitter_keys)["secret"])


def get_twitter_accounts_tweets(accounts, twitter_keys):
    tweets = []

    for account in accounts:
        session = requests.session()
        session.auth = get_twitter_auth(twitter_keys)
        session.params = {'screen_name': account, 'tweet_mode': 'extended', 'include_rts': 'false'}
        response = session.get(get_twitter_account_timeline_url())
        results = json.loads(response.content)
        tweets.extend(results)

    return tweets


def get_twitter_search_tweets(words, twitter_keys):
    tweets = []

    # TODO - Naming
    # TODO - Multiple call
    for word in words:
        session = requests.session()
        session.auth = get_twitter_auth(twitter_keys)
        session.params = {'q': word + " AND -filter:retweets", 'tweet_mode': 'extended', 'result_type': 'recent'}
        response = session.get(TWITTER_API_SEARCH_URL)
        results = json.loads(response.content)
        tweets.extend(results["statuses"])
    return tweets


def get_twitter_bearer_token(twitter_keys):
    session = requests.session()
    session.auth = (get_twitter_consumer(twitter_keys)["key"], get_twitter_consumer(twitter_keys)["secret"])
    session.params = {'grant_type': 'client_credentials'}

    response = session.post(TWITTER_API_AUTH_URL)
    content = json.loads(response.content.decode("utf-8"))
    return content["access_token"]


def get_twitter_hashtag_tweets(hashtags, twitter_keys):
    tweets = []

    bearer_token = get_twitter_bearer_token(twitter_keys)

    for hashtag in hashtags:
        session = requests.session()
        session.headers = {"Authorization": "Bearer " + bearer_token}
        session.params = {"q": '#' + hashtag + " AND -filter:retweets", 'tweet_mode': 'extended',
                          'result_type': 'recent'}

        #  TODO - response = session.get(TWITTER_API_HASHTAG_URL)
        response = session.get(TWITTER_API_SEARCH_URL)
        result = json.loads(response.content.decode("utf-8"))

        tweets.extend(result["statuses"])
    return tweets


def download_twitter_data():
    with open(CONFIG_JSON_FILE_NAME) as file:
        config = json.load(file)

    session = requests.session()
    session.params = {}
    response = session.get("http://backend:8080/sources/")
    sources_json = json.loads(response.content.decode("utf-8"))

    twitter_keys = get_twitter_keys(config)

    tweet_responses = []
    tweet_responses.extend(get_twitter_accounts_tweets(get_twitter_accounts(sources_json), twitter_keys))
    tweet_responses.extend(get_twitter_search_tweets(get_twitter_search_words(sources_json), twitter_keys))
    tweet_responses.extend(get_twitter_hashtag_tweets(get_twitter_hashtags(sources_json), twitter_keys))

    texts = []

    mongo_client = MongoClient("mongodb://content_database:27017/")
    mongo_db = mongo_client['content_database']
    twitter_collection = mongo_db['tweet']

    for tweet in tweet_responses:
        tweet_author = TweetAuthor(tweet["user"]["screen_name"], tweet["user"]["location"],
                                   tweet["user"]["followers_count"])
        tweet_object = Tweet(tweet["full_text"], parser().parse(tweet["created_at"]).strftime("%Y-%m-%dT%H:%M:%SZ"),
                             tweet["id_str"], tweet["lang"],
                             tweet["retweet_count"],
                             tweet["favorite_count"], tweet_author)
        texts.append(tweet_object)
        if twitter_collection.find({'text': tweet_object.text, 'tweetId': tweet_object.tweet_id}).count() is 0:
            print(tweet_object.get_dict_object())
            twitter_collection.insert_one(tweet_object.get_dict_object())


# TODO - Source validation

if __name__ == '__main__':
    download_twitter_data()
