import json
import pandas as pd

from sklearn.feature_extraction.text import TfidfVectorizer, CountVectorizer, TfidfTransformer
from sklearn.metrics import accuracy_score
from sklearn.multiclass import OneVsRestClassifier
from sklearn.naive_bayes import MultinomialNB
from sklearn.pipeline import Pipeline
from sklearn.model_selection import train_test_split
from sklearn.svm import LinearSVC

from pojo import Tweet, get_tweet_object_from_dict

STOPWORDS_JSON_FILE_NAME = "../stopwords-iso.json"


def remove_not_neccessary_chars(text):
    chars = [".", ",", "-", "(", ")", "\"", "\'", "?", "–", "!"]
    returned_text = text

    for char in chars:
        returned_text = returned_text.replace(char, "")

    return returned_text


def remove_stopwords_from_text(tweet, stopwords):
    tweet_words = remove_not_neccessary_chars(tweet.text).lower().split()

    if tweet.language == "und":
        return tweet_words

    localized_stopwords = (stopwords[tweet.language])

    words = ""

    for word in tweet_words:
        if word not in localized_stopwords:
            words += (" " + word)

    return words


def get_data_frame_from_text_objects(text_objects, topic_ids):
    data_frame_input = {'id': [], 'text': []}
    for topic in topic_ids:
        data_frame_input[topic] = []

    for tweet in text_objects:
        data_frame_input['id'].append(tweet['_id']['$oid'])
        data_frame_input['text'].append(
            ("@" + tweet["author"]["username"]) + " " + remove_stopwords_from_text(get_tweet_object_from_dict(tweet),
                                                                           stopwords))
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

with open("../twitter.json") as file:
    tweets = json.load(file)

with open(STOPWORDS_JSON_FILE_NAME) as file:
    stopwords = json.load(file)

topic_ids = []

for topic in topics["topics"]:
    topic_ids.append(topic["id"])

tweets_data_frame = get_data_frame_from_text_objects(tweets, topic_ids)

print("Tweet Count: {}".format(len(tweets_data_frame)))
print("Topic Stats")
print(get_data_frame_stats(tweets_data_frame))

train, test = train_test_split(tweets_data_frame, random_state=42, test_size=0.33, shuffle=True)
X_train = train.text
X_test = test.text

NB_pipeline = Pipeline([
    ('tfidf', TfidfVectorizer()),
    ('clf', OneVsRestClassifier(LinearSVC(), n_jobs=1)),
])

models = []
for topic_id in topic_ids:
    model = NB_pipeline.fit(X_train, train[topic_id])
    models.append({"topic": topic_id, "model": model})
    prediction = NB_pipeline.predict(X_test)

    print('{}: Test accuracy is {}'.format(topic_id, accuracy_score(test[topic_id], prediction)))
    for text in X_test:
        if NB_pipeline.predict([text])[0]:
            print(text)

    print()

print(len(X_test))
