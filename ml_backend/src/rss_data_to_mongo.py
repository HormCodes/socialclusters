import json
import ssl

import feedparser
import requests
# TODO - Correct solution?
from pymongo import MongoClient

if hasattr(ssl, '_create_unverified_context'):
    ssl._create_default_https_context = ssl._create_unverified_context

session = requests.session()
session.params = {}
response = session.get("http://localhost:8080/sources/")
sources_json = json.loads(response.content.decode("utf-8"))


# TODO - Test
def get_rss_links(sources_json):
    rss_links = []

    for source in sources_json:
        if source['valueType'] == 'rss':
            rss_links.append(source['value'])

    return rss_links


def download_rss_data():
    rss_links = get_rss_links(sources_json)

    mongo_client = MongoClient("mongodb://localhost:27017/")
    mongo_db = mongo_client['content_database']
    news_collection = mongo_db['news']

    for rss_link in rss_links:
        feed = feedparser.parse(rss_link)
        for entry in feed.entries:
            article_object = {
                'title': entry['title'],
                'summary': entry['summary'].replace('\xa0', ' '),
                'timestamp': entry['published'],
                'url': entry['link'],
                'text': entry['title'] + ' ' + entry['summary'].replace('\xa0', ' '),
                'publisher': {'name': feed.feed['title'], 'url': feed.feed['title']},
                'language': feed.feed['language']
            }
            if news_collection.find(article_object).count() is 0:
                print(article_object)
                news_collection.insert_one(article_object)


if __name__ == '__main__':
    download_rss_data()
