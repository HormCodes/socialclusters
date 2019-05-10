import majka
import majka
import time

import pandas as pd
from nltk import collections
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics import accuracy_score
from sklearn.model_selection import train_test_split
from sklearn.multiclass import OneVsRestClassifier
from sklearn.naive_bayes import MultinomialNB
from sklearn.pipeline import Pipeline

from text_cleaning import remove_mess_chars, remove_stopwords, \
    convert_words_into_lemmas


def get_data_frame_stats(data_frame):
    df_toxic = data_frame.drop(['text'], axis=1)
    counts = []
    categories = list(df_toxic.columns.values)
    for i in categories:
        counts.append((i, df_toxic[i].sum()))
    df_stats = pd.DataFrame(counts, columns=['category', 'number_of_tweets'])
    return df_stats


morph = majka.Majka("../majka/majka.w-lt")
# topic_ids = ['World', "Business", "Sports", "SciTech"]
# with open('../dataset_news.json') as json_file:
#     data = json.load(json_file)
#
# df_input = {'text': [], 'World': [], "Business": [], "Sports": [], "SciTech": []}
#
# for new in data:
#     df_input['text'].append(new['content'])
#
#     if len(new['annotation']['label']) > 1:
#         print(new['content'])
#     for topic_id in topic_ids:
#         if topic_id == new['annotation']['label'][0]:
#             df_input[topic_id].append(1)
#         else:
#             df_input[topic_id].append(0)

topic_ids = ['traffic', "sport", "work", "culture", "events", "politics"]
df = pd.read_csv('../dataset.csv', delimiter=';')
print(df.head())

print("Tweet Count: {}".format(len(df)))
print("Topic Stats")
print(get_data_frame_stats(df))

train, test = train_test_split(df, random_state=42, test_size=0.33, shuffle=True)
X_train = train.text.apply(lambda text: convert_words_into_lemmas(remove_stopwords(remove_mess_chars(text)), morph))
X_test = test.text.apply(lambda text: convert_words_into_lemmas(remove_stopwords(remove_mess_chars(text)), morph))

wordcount = {}
for text in X_train.append(X_test):
    for word in text.split():
        if word not in wordcount:
            wordcount[word] = 1
        else:
            wordcount[word] += 1

word_counter = collections.Counter(wordcount)
n_print = int(input("How many most common words to print: "))
for word, count in word_counter.most_common(n_print):
    print(count, word)
# MultiLabelBinarizer().fit_transform(train)

start = time.time()

train, test = train_test_split(df, random_state=42, test_size=0.33, shuffle=True)
X_train = train.text.apply(lambda text: convert_words_into_lemmas(remove_stopwords(remove_mess_chars(text)), morph))
X_test = test.text.apply(lambda text: convert_words_into_lemmas(remove_stopwords(remove_mess_chars(text)), morph))

NB_pipeline = Pipeline([
    ('tfidf', TfidfVectorizer()),
    # ('clf', OneVsRestClassifier(LinearSVC(), n_jobs=1)),
    # ('clf', LinearSVC()),
    ('clf', OneVsRestClassifier(MultinomialNB(fit_prior=True, class_prior=None), n_jobs=1)),
    # ('clf', OneVsRestClassifier(LogisticRegression(solver='sag'), n_jobs=1)),
])
# drop = train.drop(['text', 'platform'], axis=1)
# print(drop.head())
# NB_pipeline.fit(X_train, drop)
# print('Test accuracy is {}'.format(accuracy_score(test.drop(['text', 'platform'], axis=1), NB_pipeline.predict(X_test))))
#

topic_accuracy = []
for topic_id in topic_ids:
    NB_pipeline.fit(X_train, train[topic_id])
    prediction = NB_pipeline.predict(X_test)

    topic_accuracy.append(accuracy_score(test[topic_id], prediction))
    print('{}: Test accuracy is {}'.format(topic_id, accuracy_score(test[topic_id], prediction)))
    # for text in X_test:
    #     if NB_pipeline.predict([text])[0]:
    #         print(text)
    #
    # print()

print('Trained in %.1f seconds' % (time.time() - start))

# print("{};{};{};{};{};{};{}".format(1 - x/10, topic_accuracy[0], topic_accuracy[1], topic_accuracy[2], topic_accuracy[3], topic_accuracy[4], topic_accuracy[5]))
