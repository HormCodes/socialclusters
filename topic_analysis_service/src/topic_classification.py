import json
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score
from sklearn.model_selection import train_test_split
from sklearn.multiclass import OneVsRestClassifier
from sklearn.multioutput import ClassifierChain
from sklearn.naive_bayes import GaussianNB
from sklearn.pipeline import Pipeline
from sklearn.svm import LinearSVC
from skmultilearn.problem_transform import BinaryRelevance, LabelPowerset

import majka
from text_cleaning import get_data_frame_from_posts, get_posts_with_cleaned_text

STOPWORDS_JSON_FILE_NAME = "../stopwords-iso.json"


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
    stopwords = json.load(file)['cs']

morph = majka.Majka("../majka/majka.w-lt")
topic_ids = []

for topic in topics["topics"]:
    topic_ids.append(topic["id"])

from pymongo import MongoClient

mongo_client = MongoClient("mongodb://content_database:27017/")
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

tweets_data_frame = get_data_frame_from_posts("twitter", get_posts_with_cleaned_text(tweets, stopwords, morph),
                                              ["author", "username"], topic_ids)

print("Tweet Count: {}".format(len(tweets_data_frame)))
print("Topic Stats")
print(get_data_frame_stats(tweets_data_frame))

train, test = train_test_split(tweets_data_frame, random_state=42, test_size=0.33, shuffle=True)
X_train = train.text
X_test = test.text

NB_pipeline = Pipeline([
    ('tfidf', TfidfVectorizer()),
    ('clf', OneVsRestClassifier(LinearSVC(), n_jobs=1)),
    # ('clf', OneVsRestClassifier(MultinomialNB(fit_prior=True, class_prior=None), n_jobs=1)),
    # ('clf', OneVsRestClassifier(LogisticRegression(solver='sag'), n_jobs=1)),
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

vectorizer = TfidfVectorizer(strip_accents='unicode', analyzer='word', ngram_range=(1, 3), norm='l2')
vectorizer.fit(X_train)
vectorizer.fit(X_test)
classifier = BinaryRelevance(GaussianNB())

Y_train = train.drop(labels=['id', 'text'], axis=1)
Y_test = test.drop(labels=['id', 'text'], axis=1)
X_train2 = vectorizer.transform(X_train)
classifier.fit(X_train2, Y_train)

X_test2 = vectorizer.transform(X_test)
predictions = classifier.predict(X_test2)

# accuracy
print("Accuracy = ", accuracy_score(Y_test, predictions))
print(predictions)

# initialize classifier chains multi-label classifier
classifier = ClassifierChain(LogisticRegression())

# Training logistic regression model on train data
classifier.fit(X_train2, Y_train)

# predict
predictions = classifier.predict(X_test2)
print(predictions)
# accuracy
print("Accuracy = ", accuracy_score(Y_test, predictions))

classifier = LabelPowerset(LogisticRegression())

# train
classifier.fit(X_train2, Y_train)

# predict
predictions = classifier.predict(X_test2)
print(predictions)

# accuracy
print("Accuracy = ", accuracy_score(Y_test, predictions))
