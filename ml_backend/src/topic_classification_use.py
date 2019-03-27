import json
import majka

import pandas as pd
import requests
from pymongo import MongoClient
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.multiclass import OneVsRestClassifier
from sklearn.pipeline import Pipeline
from sklearn.svm import LinearSVC

from text_cleaning import get_data_frame_from_posts, get_posts_with_cleaned_text

STOPWORDS_JSON_FILE_NAME = "../stopwords-iso.json"

platforms = [
    {'collection': 'tweet', 'id': 'twitter', 'sourcePath': ["author", "username"]},
    {'collection': 'news', 'id': 'news', 'sourcePath': ["publisher", "name"]},
    {'collection': 'facebook_posts', 'id': 'facebook', 'sourcePath': []},
    {'collection': 'reddit_posts', 'id': 'reddit', 'sourcePath': ["author"]},
]

mongo_client = MongoClient("mongodb://localhost:27017/")
mongo_db = mongo_client['content_database']

with open(STOPWORDS_JSON_FILE_NAME) as file:
    stopwords = json.load(file)['cs']  # TODO

morph = majka.Majka("../majka/majka.w-lt")


def get_topics():
    session = requests.session()
    session.params = {}
    response = session.get("http://localhost:8080/topics/")
    topics_json = json.loads(response.content.decode("utf-8"))
    topic_ids = []
    for topic in topics_json:
        topic_ids.append(topic["textId"])
    return topic_ids


def get_training_data_frame(topic_ids):
    data_frames = []
    for platform in platforms:
        posts = []
        posts_collection = mongo_db[platform['collection']]
        for post in posts_collection.find({'$and': [{'topics': {'$exists': True}}, {'topics': {'$ne': []}}]}):
            posts.append(post)

        data_frame = get_data_frame_from_posts(platform['id'],
                                               get_posts_with_cleaned_text(posts, stopwords, morph),
                                               platform['sourcePath'], topic_ids)

        data_frames.append(data_frame)

    return pd.concat(data_frames)


def get_models():
    topic_ids = get_topics()
    training_data_frame = get_training_data_frame(topic_ids)

    models = []
    for topic_id in topic_ids:
        model = Pipeline([
            ('tfidf', TfidfVectorizer()),
            ('clf', OneVsRestClassifier(LinearSVC(), n_jobs=1)),
            # ('clf', OneVsRestClassifier(MultinomialNB(fit_prior=True, class_prior=None), n_jobs=1)),
            # ('clf', OneVsRestClassifier(LogisticRegression(solver='sag'), n_jobs=1)),
        ])
        model.fit(training_data_frame.text, training_data_frame[topic_id])
        models.append({"topic": topic_id, "model": model})

    return models


def suggest_topics(models):
    for platform in platforms:
        posts = []
        posts_collection = mongo_db[platform['collection']]
        for post in posts_collection.find({'$or': [{'topics': {'$exists': False}}, {'topics': {'$eq': []}}]}):
            posts.append(post)

        data_frame = get_data_frame_from_posts(platform['id'],
                                               get_posts_with_cleaned_text(posts, stopwords, morph),
                                               platform['sourcePath'], [])  # TODO - Refactor empty topics

        for model in models:

            print(model['topic'])
            for post in data_frame.values:
                if model['model'].predict([post[1]])[0]:
                    print(post[1])
                    posts_collection.update_one({'_id': post[0]}, {'$set': {'suggestedTopics': []}})
                    posts_collection.update_one({'_id': post[0]}, {'$addToSet': {'suggestedTopics': model['topic']}})

            print()


if __name__ == '__main__':
    suggest_topics(get_models())
