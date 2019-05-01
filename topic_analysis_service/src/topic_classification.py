import json
import majka

import pandas as pd
import requests
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics import accuracy_score
from sklearn.model_selection import train_test_split
from sklearn.multiclass import OneVsRestClassifier
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import MultiLabelBinarizer
from sklearn.svm import LinearSVC

from text_cleaning import get_data_frame_from_posts, get_posts_with_cleaned_text


def get_data_frame_stats(data_frame):
    df_toxic = data_frame.drop(['id', 'text'], axis=1)
    counts = []
    categories = list(df_toxic.columns.values)
    for i in categories:
        counts.append((i, df_toxic[i].sum()))
    df_stats = pd.DataFrame(counts, columns=['category', 'number_of_tweets'])
    return df_stats


def get_topics():
    session = requests.session()
    session.params = {}
    response = session.get("http://localhost:8080/topics/")
    topics_json = json.loads(response.content.decode("utf-8"))
    topic_ids = []
    for topic in topics_json:
        topic_ids.append(topic["textId"])
    return topic_ids


morph = majka.Majka("../majka/majka.w-lt")
topic_ids = []

for topic in get_topics():
    topic_ids.append(topic)

from pymongo import MongoClient

mongo_client = MongoClient("mongodb://localhost:27017/")
mongo_db = mongo_client['content_database']
twitter_collection = mongo_db['tweet']

tweets = []

for tweet_object in twitter_collection.find({}):
    if tweet_object is not None:
        try:
            test = tweet_object["topics"]
        except KeyError:
            pass
        else:
            tweets.append(tweet_object)

tweets_data_frame = get_data_frame_from_posts("twitter", get_posts_with_cleaned_text(tweets, morph),
                                              ["author", "username"], topic_ids)

print("Tweet Count: {}".format(len(tweets_data_frame)))
print("Topic Stats")
print(get_data_frame_stats(tweets_data_frame))

train, test = train_test_split(tweets_data_frame, random_state=42, test_size=0.33, shuffle=True)
X_train = train.text
X_test = test.text

MultiLabelBinarizer().fit_transform(train)

NB_pipeline = Pipeline([
    ('tfidf', TfidfVectorizer()),
    ('clf', OneVsRestClassifier(LinearSVC(), n_jobs=1)),
    # ('clf', LinearSVC()),
    # ('clf', MultinomialNB(fit_prior=True, class_prior=None)),
    # ('clf', OneVsRestClassifier(LogisticRegression(solver='sag'), n_jobs=1)),
])
# drop = train.drop(['id', 'text'], axis=1)
# print(drop.head())
# NB_pipeline.fit(X_train, drop)
# for text in X_test:
#
#     print()
#     predictions = NB_pipeline.predict([text])
#     print(text)
#     for index, topic_id in enumerate(topic_ids):
#         if predictions[0][index] == 1:
#             print(topic_id)

for topic_id in topic_ids:
    NB_pipeline.fit(X_train, train[topic_id])
    prediction = NB_pipeline.predict(X_test)

    print('{}: Test accuracy is {}'.format(topic_id, accuracy_score(test[topic_id], prediction)))
    for text in X_test:
        if NB_pipeline.predict([text])[0]:
            print(text)

    print()
