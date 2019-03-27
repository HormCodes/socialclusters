import json
import majka

import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.multiclass import OneVsRestClassifier
from sklearn.pipeline import Pipeline
from sklearn.svm import LinearSVC

from text_cleaning import get_data_frame_from_posts, get_posts_with_cleaned_text

STOPWORDS_JSON_FILE_NAME = "../stopwords-iso.json"

with open("../topics.json") as file:
    topics = json.load(file)

with open(STOPWORDS_JSON_FILE_NAME) as file:
    stopwords = json.load(file)

morph = majka.Majka("../majka/majka.w-lt")
topic_ids = []

for topic in topics["topics"]:
    topic_ids.append(topic["id"])

from pymongo import MongoClient

mongo_client = MongoClient("mongodb://localhost:27017/")
mongo_db = mongo_client['content_database']
twitter_collection = mongo_db['tweet']

tweets = []
test_tweets = []

for tweet_object in twitter_collection.find({}):
    if tweet_object is not None:
        try:
            test = tweet_object["topics"]
        except KeyError:
            tweet_object['topics'] = []
            test_tweets.append(tweet_object)
        else:
            if tweet_object['topics'] == []:
                test_tweets.append(tweet_object)
            else:
                tweets.append(tweet_object)

news_collection = mongo_db['news']
test_news = []

for news_object in news_collection.find({}):
    if news_object is not None:
        try:
            test = news_object["topics"]
        except KeyError:
            news_object['topics'] = []
            test_news.append(news_object)
        else:
            if news_object['topics'] == []:
                test_news.append(news_object)

tweets_data_frame = get_data_frame_from_posts("twitter", get_posts_with_cleaned_text(tweets, stopwords, morph),
                                              ["author", "username"], topic_ids)
test_tweets_data_frame = get_data_frame_from_posts("twitter",
                                                   get_posts_with_cleaned_text(test_tweets, stopwords, morph),
                                                   ["author", "username"], topic_ids)
test_news_data_frame = get_data_frame_from_posts("news", get_posts_with_cleaned_text(test_news, stopwords, morph),
                                                 ["publisher", "name"], topic_ids)

test_data_frames = pd.concat([tweets_data_frame, test_news_data_frame])

X_train = tweets_data_frame.text

NB_pipeline = Pipeline([
    ('tfidf', TfidfVectorizer()),
    ('clf', OneVsRestClassifier(LinearSVC(), n_jobs=1)),
    # ('clf', OneVsRestClassifier(MultinomialNB(fit_prior=True, class_prior=None), n_jobs=1)),
    # ('clf', OneVsRestClassifier(LogisticRegression(solver='sag'), n_jobs=1)),
])

models = []
for topic_id in topic_ids:
    model = NB_pipeline.fit(X_train, tweets_data_frame[topic_id])
    models.append({"topic": topic_id, "model": model})

    print(topic_id)
    for post in test_data_frames.values:
        if NB_pipeline.predict([post[1]])[0]:
            print(post[0])
            print(post[1])
            twitter_collection.update_one({'_id': post[0]}, {'$addToSet': {'suggestedTopics': topic_id}})

    print()

print(len(test_tweets) + len(test_news))
