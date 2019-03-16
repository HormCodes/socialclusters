import json
import majka

import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.multiclass import OneVsRestClassifier
from sklearn.pipeline import Pipeline
from sklearn.svm import LinearSVC

from pojo import get_tweet_object_from_dict

STOPWORDS_JSON_FILE_NAME = "../stopwords-iso.json"


def remove_not_neccessary_chars(text):
    chars = [".", ",", "-", "(", ")", "\"", "\'", "?", "–", "!"]
    returned_text = text

    for char in chars:
        returned_text = returned_text.replace(char, "")

    return returned_text


def get_lemma(word, morph):
    lemma_result = morph.find(word)
    if len(lemma_result) is 0:
        return word
    else:
        return lemma_result[0]['lemma']


def remove_stopwords_from_text(tweet, stopwords, morph):
    tweet_words = remove_not_neccessary_chars(tweet.text).lower().split()

    if tweet.language == "und":
        return "".join(tweet_words)

    localized_stopwords = (stopwords[tweet.language])

    words = ""

    for word in tweet_words:
        if word not in localized_stopwords:
            words = words + (" " + get_lemma(word, morph))

    return words


def get_data_frame_from_text_objects(text_objects, topic_ids):
    data_frame_input = {'id': [], 'text': []}
    for topic in topic_ids:
        data_frame_input[topic] = []

    for tweet in text_objects:
        data_frame_input['id'].append(tweet['_id'])
        data_frame_input['text'].append(
            ("@" + tweet["author"]["username"]) + " " + remove_stopwords_from_text(get_tweet_object_from_dict(tweet),
                                                                                   stopwords, morph))
        for topic in topic_ids:
            if topic in tweet["topics"]:
                data_frame_input[topic].append(True)
            else:
                data_frame_input[topic].append(False)

    return pd.DataFrame(data_frame_input)


def get_data_frame_stats(data_frame):
    df_toxic = data_frame.drop(['id', 'text'], axis=1)
    counts = []
    categories = list(df_toxic.columns.values)
    for i in categories:
        counts.append((i, df_toxic[i].sum()))
    df_stats = pd.DataFrame(counts, columns=['category', 'number_of_tweets'])
    return df_stats


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
            tweets.append(tweet_object)

tweets_data_frame = get_data_frame_from_text_objects(tweets, topic_ids)
test_tweets_data_frame = get_data_frame_from_text_objects(test_tweets, topic_ids)

print("Tweet Count: {}".format(len(tweets_data_frame)))
print("Topic Stats")
print(get_data_frame_stats(tweets_data_frame))

X_train = tweets_data_frame.text

NB_pipeline = Pipeline([
    ('tfidf', TfidfVectorizer()),
    ('clf', OneVsRestClassifier(LinearSVC(), n_jobs=1)),
])

models = []
for topic_id in topic_ids:
    model = NB_pipeline.fit(X_train, tweets_data_frame[topic_id])
    models.append({"topic": topic_id, "model": model})

    print(topic_id)
    for text in test_tweets_data_frame.text:
        if NB_pipeline.predict([text])[0]:
            print(text)

    print()

print(len(test_tweets))
