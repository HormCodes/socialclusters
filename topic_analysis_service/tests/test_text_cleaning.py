import majka
from unittest import TestCase

import pandas as pd
from pandas.util.testing import assert_frame_equal

from text_cleaning import remove_stopwords, remove_mess_chars, convert_words_into_lemmas, get_data_frame_from_posts, \
    get_post_with_cleaned_text

STOPWORDS_JSON_FILE_NAME = '../stopwords-iso.json'


class TextCleaning(TestCase):
    def test_remove_stopwords(self):
        self.assertEqual('', remove_stopwords(''))
        self.assertEqual('', remove_stopwords('a a a'))

    def test_remove_mess_chars(self):
        self.assertEqual('', remove_mess_chars('!'))
        ...

    def test_convert_words_into_lemmas(self):
        morph = majka.Majka("../majka/cs.w-lt")

        # TODO - Space at start
        self.assertEqual(' tramvaj jet člověk', convert_words_into_lemmas('tramvají jedou lidé', morph))

    def test_get_data_frame_from_posts(self):
        posts = [{'text': 'ahoj', '_id': '123', 'author': {'username': 'horm'}}]
        topics = []
        platform = "twitter"
        keys_to_source = ["author", "username"]

        # TODO - Platform as a feature
        data_frame = pd.DataFrame({'id': ['123'], 'text': ['twitter horm ahoj']})

        assert_frame_equal(data_frame, get_data_frame_from_posts(platform, posts, keys_to_source, topics))
        self.assertEqual(True, True)  # Remove static warning

    def test_get_post_with_cleaned_text(self):
        post = {'text': 'a ! ahoj tramvají'}
        morph = majka.Majka("../majka/cs.w-lt")

        self.assertEqual({'text': ' ahoj tramvaj'}, get_post_with_cleaned_text(post, morph))
