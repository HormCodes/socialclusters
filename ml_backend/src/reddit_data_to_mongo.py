import json

import praw
import requests
from pymongo import MongoClient


# TODO - Test
def get_subreddits(sources_json):
    subreddits = []

    for source in sources_json:
        if source['platform'] == 'reddit':
            subreddits.append(source['value'])

    return subreddits


def download_reddit_data():
    CONFIG_JSON_FILE_NAME = "../config.json"

    with open(CONFIG_JSON_FILE_NAME) as file:
        config = json.load(file)["keys"]['reddit']

    reddit = praw.Reddit(client_id=config['clientId'],
                         client_secret=config['clientSecret'],
                         user_agent=config['userAgent'],
                         username=config['username'],
                         password=config['password'])

    session = requests.session()
    session.params = {}
    response = session.get("http://localhost:8080/sources/")
    sources_json = json.loads(response.content.decode("utf-8"))

    mongo_client = MongoClient("mongodb://localhost:27017/")
    mongo_db = mongo_client['content_database']
    reddit_collection = mongo_db['reddit_posts']

    for subreddit in get_subreddits(sources_json):
        brno = reddit.subreddit(subreddit)  # TODO - Variable name
        for submission in brno.new(limit=100):

            if reddit_collection.find({'timestamp': submission.created_utc,
                                       'permalink': submission.permalink}).count() is 0 and submission.selftext is not "":
                post_object = {
                    'title': submission.title,
                    'body': submission.selftext,
                    'text': submission.title + ' ' + submission.selftext,
                    'subreddit': submission.subreddit_name_prefixed,
                    'author': submission.author.name,
                    'score': submission.score,
                    'timestamp': int(submission.created_utc),
                    'comments': submission.num_comments,
                    'permalink': submission.permalink
                }
                reddit_collection.insert_one(post_object)
                print(post_object)


if __name__ == '__main__':
    download_reddit_data()
