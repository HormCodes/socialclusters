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

    words = []

    for word in tweet_words:
        if word not in localized_stopwords:
            words.append(word)

    return words
