import datetime
import majka

from nltk import collections
from pymongo import MongoClient

from pojo import platforms, Config
from text_cleaning import convert_words_into_lemmas, remove_stopwords, remove_mess_chars


def get_posts_from_range(config, from_timestamp, to_timestamp):
    mongo_client = MongoClient("mongodb://" + config.contentDatabaseHost + ":27017/")
    mongo_db = mongo_client['content_database']
    posts = []
    for platform in platforms:
        posts_collection = mongo_db[platform['collection']]
        for post in posts_collection.find(
            {'timestamp': {'$gte': from_timestamp, '$lte': to_timestamp}}):  # TODO - Timestamp
            posts.append(post)
    return posts


def get_word_counts(config, from_timestamp, to_timestamp, count):
    morph = majka.Majka("../majka/majka.w-lt")

    posts = get_posts_from_range(config, from_timestamp, to_timestamp)
    wordcount = {}
    for post in posts:
        words = convert_words_into_lemmas(remove_stopwords(remove_mess_chars(post['text'])), morph).split()
        for word in words:
            if word not in wordcount:
                wordcount[word] = 1
            else:
                wordcount[word] += 1

    word_counter = collections.Counter(wordcount)
    words = []
    for word in word_counter.most_common(count):
        words.append({'text': word[0], 'value': word[1]})
    return words


if __name__ == '__main__':
    config = Config("localhost", "localhost", "localhost")

    now = datetime.datetime.now()
    week_ago = now - datetime.timedelta(days=7)
    words = get_word_counts(config, week_ago.isoformat(), now.isoformat(), 100)
    print(words)
