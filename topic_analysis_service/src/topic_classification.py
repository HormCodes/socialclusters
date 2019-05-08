import majka
import majka
import time

import pandas as pd
import psycopg2
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.model_selection import train_test_split
from sklearn.multiclass import OneVsRestClassifier
from sklearn.pipeline import Pipeline
from sklearn.svm import LinearSVC

from text_cleaning import remove_mess_chars, remove_stopwords, \
    convert_words_into_lemmas


def get_data_frame_stats(data_frame):
    df_toxic = data_frame.drop(['id', 'text'], axis=1)
    counts = []
    categories = list(df_toxic.columns.values)
    for i in categories:
        counts.append((i, df_toxic[i].sum()))
    df_stats = pd.DataFrame(counts, columns=['category', 'number_of_tweets'])
    return df_stats


def get_topics():
    connection = psycopg2.connect(user="postgres",
                                  password="postgres",
                                  host="localhost",
                                  port="5432",
                                  database="user_database")
    cursor = connection.cursor()
    cursor.execute("select * from topic")
    topics = cursor.fetchall()
    topic_ids = []
    for topic in topics:
        topic_ids.append(topic[2])
    return topic_ids


morph = majka.Majka("../majka/majka.w-lt")
topic_ids = ['traffic', "sport", "work", "culture", "events", "politics"]

df = pd.read_csv("../dataset.csv", sep=';', )
print(df.head())

print("Tweet Count: {}".format(len(df)))
print("Topic Stats")
print(get_data_frame_stats(df))
for x in reversed(range(1, 10, 1)):
    pass

start = time.time()
train, test = train_test_split(df.sort_values('sport'), random_state=42, test_size=x / 10, shuffle=True)
X_train = train.text.apply(lambda text: convert_words_into_lemmas(remove_stopwords(remove_mess_chars(text)), morph))
X_test = test.text

# MultiLabelBinarizer().fit_transform(train)

NB_pipeline = Pipeline([
    ('tfidf', TfidfVectorizer()),
    ('clf', OneVsRestClassifier(LinearSVC(), n_jobs=1)),
    # ('clf', LinearSVC()),
    #('clf', OneVsRestClassifier(MultinomialNB(fit_prior=True, class_prior=None), n_jobs=1)),
    # ('clf', OneVsRestClassifier(LogisticRegression(solver='sag'), n_jobs=1)),
])
# drop = train.drop(['id', 'text', 'platform'], axis=1)
# print(drop.head())
# NB_pipeline.fit(X_train, drop)
# print('Test accuracy is {}'.format(accuracy_score(test.drop(['id', 'text', 'platform'], axis=1), NB_pipeline.predict(X_test))))
#

topic_accuracy = []
for topic_id in topic_ids:
    NB_pipeline.fit(X_train, train[topic_id])
    # prediction = NB_pipeline.predict(X_test)

    # topic_accuracy.append(accuracy_score(test[topic_id], prediction))
    # print('{}: Test accuracy is {}'.format(topic_id, accuracy_score(test[topic_id], prediction)))
    # for text in X_test:
    #     if NB_pipeline.predict([text])[0]:
    #         print(text)
    #
    # print()

print('Trained in %.1f seconds' % (time.time() - start))

#print("{};{};{};{};{};{};{}".format(1 - x/10, topic_accuracy[0], topic_accuracy[1], topic_accuracy[2], topic_accuracy[3], topic_accuracy[4], topic_accuracy[5]))
