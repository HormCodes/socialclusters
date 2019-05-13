

from unittest import TestCase

import pandas as pd
from pandas.util.testing import assert_frame_equal

from src.text_cleaning import remove_stopwords, remove_mess_chars, get_data_frame_from_posts, \
    get_post_with_cleaned_text

STOPWORDS_JSON_FILE_NAME = '../stopwords-iso.json'


class TextCleaning(TestCase):
    def test_remove_stopwords(self):
        self.assertEqual('', remove_stopwords('', 'cs'))
        self.assertEqual('', remove_stopwords('a a a', 'cs'))

    def test_remove_mess_chars(self):
        self.assertEqual('', remove_mess_chars('!'))
        ...

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
        post = {'text': 'Jak se máš? a ahoj tramvají!'}
        post2 = {'text': 'afa alk uajd akgks akhf'}

        self.assertEqual(' tramvají', remove_stopwords(remove_mess_chars(post['text']), 'cs'))
        self.assertEqual({'text': ' tramvají'}, get_post_with_cleaned_text(post))
        self.assertEqual({'text': ' afa alk uajd akgks akhf'}, get_post_with_cleaned_text(post2))
