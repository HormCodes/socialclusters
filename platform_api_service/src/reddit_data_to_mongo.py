import json

import praw
import psycopg2
from pymongo import MongoClient

# TODO - Test
from pojo import Config
from timestamps import get_iso_timestamp_from_unix_timestamp


def get_subreddits(config):
    connection = psycopg2.connect(user="postgres",
                                  password="postgres",
                                  host=config.userDatabaseHost,
                                  port="5432",
                                  database="user_database")
    cursor = connection.cursor()
    cursor.execute("select * from source where platform='reddit'")
    topics = cursor.fetchall()
    topic_ids = []
    for topic in topics:
        topic_ids.append(topic[3])
    return topic_ids


def download_reddit_data(config):
    CONFIG_JSON_FILE_NAME = "../config.json"

    with open(CONFIG_JSON_FILE_NAME) as file:
        config_keys = json.load(file)["keys"]['reddit']

    reddit = praw.Reddit(client_id=config_keys['clientId'],
                         client_secret=config_keys['clientSecret'],
                         user_agent=config_keys['userAgent'],
                         username=config_keys['username'],
                         password=config_keys['password'])

    mongo_client = MongoClient("mongodb://" + config.contentDatabaseHost + ":27017/")
    mongo_db = mongo_client['content_database']
    reddit_collection = mongo_db['reddit_posts']

    for subreddit in get_subreddits(config):
        brno = reddit.subreddit(subreddit)  # TODO - Variable name
        for submission in brno.new(limit=100):

            if reddit_collection.find(
                {'permalink': submission.permalink}).count() is 0 and submission.selftext is not "":
                post_object = {
                    'title': submission.title,
                    'body': submission.selftext,
                    'text': submission.title + ' ' + submission.selftext,
                    'subreddit': submission.subreddit_name_prefixed,
                    'author': submission.author.name,
                    'score': submission.score,
                    'timestamp': get_iso_timestamp_from_unix_timestamp(submission.created_utc),
                    'comments': submission.num_comments,
                    'permalink': submission.permalink
                }
                reddit_collection.insert_one(post_object)


if __name__ == '__main__':
    config = Config("localhost", "localhost", "localhost")
    download_reddit_data(config)
