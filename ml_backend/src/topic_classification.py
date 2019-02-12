import json
import pandas as pd

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics import accuracy_score
from sklearn.multiclass import OneVsRestClassifier
from sklearn.naive_bayes import MultinomialNB
from sklearn.pipeline import Pipeline
from sklearn.model_selection import train_test_split

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


with open("../topics.json") as file:
    topics = json.load(file)


with open("../twitter.json") as file:
    tweets = json.load(file)

with open(STOPWORDS_JSON_FILE_NAME) as file:
    stopwords = json.load(file)

topic_ids = []

for topic in topics["topics"]:
    topic_ids.append(topic["id"])

print(topic_ids)

data_frame_input = {'id': [], 'text': []}
for topic in topic_ids:
    data_frame_input[topic] = []

for tweet in tweets:
    data_frame_input['id'].append(tweet['_id']['$oid'])
    data_frame_input['text'].append(tweet["author"]["username"] + " " + remove_stopwords_from_text(get_tweet_object_from_dict(tweet), stopwords))
    for topic in topic_ids:
        if topic in tweet["topics"]:
            data_frame_input[topic].append(True)
        else:
            data_frame_input[topic].append(False)

tweets_data_frame = pd.DataFrame(data_frame_input)

print(tweets_data_frame["text"])

df_toxic = tweets_data_frame.drop(['id', 'text'], axis=1)
print(df_toxic)
counts = []
categories = list(df_toxic.columns.values)
print(categories)
for i in categories:
    counts.append((i, df_toxic[i].sum()))
df_stats = pd.DataFrame(counts, columns=['category', 'number_of_tweets'])
print(df_stats)




train, test = train_test_split(tweets_data_frame, random_state=42, test_size=0.33, shuffle=True)

X_train = train.text
X_test = test.text

NB_pipeline = Pipeline([
    ('tfidf', TfidfVectorizer(stop_words=stopwords)),
    ('clf', OneVsRestClassifier(MultinomialNB(fit_prior=True, class_prior=None))),
])

for topic_id in topic_ids:
    NB_pipeline.fit(X_train, train[topic_id])
    prediction = NB_pipeline.predict(X_test)
    print('{}: Test accuracy is {}'.format(topic_id ,accuracy_score(test[topic_id], prediction)))
