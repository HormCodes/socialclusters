import majka

import pandas as pd
import psycopg2
from pymongo import MongoClient
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.multiclass import OneVsRestClassifier
from sklearn.pipeline import Pipeline
from sklearn.svm import LinearSVC

from pojo import Config, platforms
from text_cleaning import get_data_frame_from_posts, get_posts_with_cleaned_text

STOPWORDS_JSON_FILE_NAME = "stopwords-iso.json"

morph = majka.Majka("../majka/majka.w-lt")


def get_topics(config):
    connection = psycopg2.connect(user="postgres",
                                  password="postgres",
                                  host=config.userDatabaseHost,
                                  port="5432",
                                  database="user_database")
    cursor = connection.cursor()
    cursor.execute("select * from topic")
    topics = cursor.fetchall()
    topic_ids = []
    for topic in topics:
        topic_ids.append(topic[2])
    return topic_ids


def get_training_data_frame(config, topic_ids):
    mongo_client = MongoClient("mongodb://" + config.contentDatabaseHost + ":27017/")
    mongo_db = mongo_client['content_database']
    data_frames = []
    for platform in platforms:
        posts = []
        posts_collection = mongo_db[platform['collection']]
        for post in posts_collection.find({'$and': [{'topics': {'$exists': True}}, {'topics': {'$ne': []}}]}):
            posts.append(post)

        data_frame = get_data_frame_from_posts(platform['id'],
                                               get_posts_with_cleaned_text(posts, morph),
                                               platform['sourcePath'], topic_ids)

        data_frames.append(data_frame)

    return pd.concat(data_frames)


def get_models(config):
    topic_ids = get_topics(config)
    training_data_frame = get_training_data_frame(config, topic_ids)

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


def suggest_topics(config, models):
    mongo_client = MongoClient("mongodb://" + config.contentDatabaseHost + ":27017/")
    mongo_db = mongo_client['content_database']
    for platform in platforms:
        posts = []
        posts_collection = mongo_db[platform['collection']]
        for post in posts_collection.find({'$or': [{'topics': {'$exists': False}}, {'topics': {'$eq': []}}]}):
            posts.append(post)

        data_frame = get_data_frame_from_posts(platform['id'],
                                               get_posts_with_cleaned_text(posts, morph),
                                               platform['sourcePath'], [])  # TODO - Refactor empty topics

        for model in models:

            print(model['topic'])
            for post in data_frame.values:
                if model['model'].predict([post[1]])[0]:
                    print(post[0])
                    print(post[1])
                    # TODO - Run for all before suggestion posts_collection.update_one({'_id': post[0]}, {'$set': {'suggestedTopics': []}})
                    posts_collection.update_one({'_id': post[0]}, {'$addToSet': {'suggestedTopics': model['topic']}})

            print()


if __name__ == '__main__':
    config = Config("localhost", "localhost", "localhost")
    suggest_topics(config, get_models(config))
