import sys

import requests
import json

from pprint import pprint

sys.path.append('/Library/Frameworks/Python.framework/Versions/3.7/lib/python3.7/site-packages')

from requests_oauthlib import OAuth1

CONFIG_JSON_FILE_NAME = "config.json"

SOURCES_JSON_FILE_NAME = "config.json"
TWITTER_KEY = "twitter"
ACCOUNTS_KEY = "accounts"

TWITTER_API_BASE_URL = "https://api.twitter.com/1.1/"


# TODO - Test
# TODO - Rename
def get_twitter_accounts(sources):
    return sources[TWITTER_KEY][ACCOUNTS_KEY]


# TODO - Test
def get_twitter_account_timeline_url():
    return TWITTER_API_BASE_URL + "statuses/user_timeline.json"


def get_twitter_keys(config):
    return config["keys"][TWITTER_KEY]


def get_twitter_access_token(twitter_keys):
    return twitter_keys["accessToken"]


def get_twitter_consumer(twitter_keys):
    return twitter_keys["consumer"]


with open(CONFIG_JSON_FILE_NAME) as file:
    config = json.load(file)

with open(SOURCES_JSON_FILE_NAME) as file:
    sources = json.load(file)

pprint(config)

twitter_keys = get_twitter_keys(config)

oauth = OAuth1(get_twitter_consumer(twitter_keys)["key"],
                  get_twitter_consumer(twitter_keys)["secret"],
            get_twitter_access_token(twitter_keys)["token"],
                  get_twitter_access_token(twitter_keys)["secret"])

session = requests.session()
session.auth = oauth
session.params = {'screen_name': "brnomycity", 'tweet_mode': 'extended'}
response = session.get(get_twitter_account_timeline_url())

results = json.loads(response.content)

pprint(results)

# TODO - Get Data

# TODO - Remove stopwords (https://github.com/stopwords-iso/stopwords-iso)

# TODO - Print texts
