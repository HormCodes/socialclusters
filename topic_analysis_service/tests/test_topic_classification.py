import json
from unittest import TestCase

from pojo import Tweet
from topic_classification import remove_not_neccessary_chars, remove_stopwords_from_text

STOPWORDS_JSON_FILE_NAME = 'ml_backend/stopwords-iso.json'


class TopicClassification(TestCase):
    def test_remove_stopwords_from_tweets(self):
        with open(STOPWORDS_JSON_FILE_NAME) as file:
            stopwords = json.load(file)

        self.assertEqual(remove_stopwords_from_text(Tweet('', None, None, 'cs', None, None, None), stopwords), [])
        self.assertEqual(remove_stopwords_from_text(Tweet('a', None, None, 'cs', None, None, None), stopwords), [])

    def test_removeNotNeccessaryChars(self):
        self.assertEqual('ahoj', remove_not_neccessary_chars('ahoj.'))
