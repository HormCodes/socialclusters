import json
from unittest import TestCase

from pojo import Tweet
from twitter_data_to_mongo import STOPWORDS_JSON_FILE_NAME, remove_stopwords_from_text, removeNotNeccessaryChars



class Tests2(TestCase):
    def test_remove_stopwords_from_tweets(self):
        with open(STOPWORDS_JSON_FILE_NAME) as file:
            stopwords = json.load(file)

        self.assertEqual(remove_stopwords_from_text(Tweet('', None, None, 'cs', None, None, None), stopwords), [])
        self.assertEqual(remove_stopwords_from_text(Tweet('a', None, None, 'cs', None, None, None), stopwords), [])


    def test_removeNotNeccessaryChars(self):
        self.assertEqual('ahoj', removeNotNeccessaryChars('ahoj.'))

