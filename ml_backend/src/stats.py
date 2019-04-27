import json
import majka

from pymongo import MongoClient

from server import STOPWORDS_JSON_FILE_NAME
from text_cleaning import get_post_with_cleaned_text

mongo_client = MongoClient("mongodb://localhost:27017/")
mongo_db = mongo_client['content_database']

platforms = [
    {'collection': 'tweet', 'id': 'twitter', 'sourcePath': ["author", "username"]},
    {'collection': 'news', 'id': 'news', 'sourcePath': ["publisher", "name"]},
    {'collection': 'facebook_posts', 'id': 'facebook', 'sourcePath': []},
    {'collection': 'reddit_posts', 'id': 'reddit', 'sourcePath': ["author"]},
]

with open(STOPWORDS_JSON_FILE_NAME) as file:
    stopwords = json.load(file)['cs']  # TODO

morph = majka.Majka("../majka/majka.w-lt")


def get_posts_from_range(from_timestamp, to_timestamp):
    posts = []
    for platform in platforms:
        posts = []
        posts_collection = mongo_db[platform['collection']]
        for post in posts_collection.find(
            {'$and': [{'topics': {'$exists': True}}, {'topics': {'$ne': []}}]}):  # TODO - Timestamp
            posts.append(post)
    return posts


def get_word_cloud(from_timestamp, to_timestamp):
    posts = get_posts_from_range(from_timestamp, to_timestamp)
    cleaned_texts = map(lambda post: get_post_with_cleaned_text(post, stopwords, morph)['text'], posts)

    return wordcloud(" ".join(cleaned_texts))
