import re

import langid
import pandas as pd
from iso639 import languages
from nltk import TweetTokenizer
from stop_words import safe_get_stop_words


def remove_stopwords(text):
    tweet_words = text.lower().split()

    text_language = langid.classify(text)[0]

    stop_words = safe_get_stop_words(languages.get(part1=text_language).name.lower()) + ["ul", "b", "v", "a", "z", "li",
                                                                                         "o", "s", "k", "i", "se",
                                                                                         "u003e", "u003c", "u", "href",
                                                                                         "u003cli", "u003ca", "u003cul",
                                                                                         "u003cb", "httpslinkcomdate",
                                                                                         "u003edalší", "n"]

    words = ""
    for word in tweet_words:
        if word not in stop_words:
            words = words + (" " + word)

    return words


def remove_mess_chars(text):
    tokenizer = TweetTokenizer()
    tokens = tokenizer.tokenize(re.sub(r'\d+\S\d+\S\d+', "DATE", text.lower()))

    chars = [".", ",", "-", "(", ")", "\"", "\'", "?", "–", "!", ":", "/", "\\", "=", "|", "“", "„", "…", "+", ">", "<",
             "[", "]"]
    returned_text = " ".join(filter(lambda token: token not in chars, tokens))

    for char in chars:
        returned_text = returned_text.replace(char, "")

    return returned_text


def convert_words_into_lemmas(text, morph):
    result = ""

    for word in text.split():
        lemma_result = morph.find(word)
        if len(lemma_result) is 0:
            result += (" " + word)
        else:
            result += (" " + lemma_result[0]['lemma'])

    return result


def nested_get(input_dict, nested_key):
    internal_dict_value = input_dict
    for k in nested_key:
        internal_dict_value = internal_dict_value.get(k, None)
        if internal_dict_value is None:
            return None
    return internal_dict_value


def get_text_for_predict_from_post(platform, post, keys_to_source):
    author = ""

    if len(keys_to_source) is not 0:
        author = nested_get(post, keys_to_source)
    text = post['text']
    platform = platform

    return platform + " " + author + " " + text


def get_data_frame_from_posts(platform, posts, keys_to_source, topic_ids):
    data_frame_input = {'id': [], 'text': []}
    for topic_id in topic_ids:
        data_frame_input[topic_id] = []

    for post in posts:
        data_frame_input['id'].append(post['_id'])

        # TODO - Learning by more properties?
        data_frame_input['text'].append(get_text_for_predict_from_post(platform, post, keys_to_source))

        for topic_id in topic_ids:
            if topic_id in post["topics"]:
                data_frame_input[topic_id].append(1)
            else:
                data_frame_input[topic_id].append(0)

    return pd.DataFrame(data_frame_input)


def get_post_with_cleaned_text(post, morph):
    post['text'] = convert_words_into_lemmas(remove_stopwords(remove_mess_chars(post['text'])), morph)
    return post


def get_posts_with_cleaned_text(posts, morph):
    return map(lambda post: get_post_with_cleaned_text(post, morph), posts)
