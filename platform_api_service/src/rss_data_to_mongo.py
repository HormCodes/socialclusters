import ssl

import feedparser
import psycopg2
# TODO - Correct solution?
from dateutil.parser import parser
from pymongo import MongoClient

from pojo import Config

if hasattr(ssl, '_create_unverified_context'):
    ssl._create_default_https_context = ssl._create_unverified_context


# TODO - Test
def get_rss_links(config):
    connection = psycopg2.connect(user="postgres",
                                  password="postgres",
                                  host=config.userDatabaseHost,
                                  port="5432",
                                  database="user_database")
    cursor = connection.cursor()
    cursor.execute("select * from source where platform='news'")
    topics = cursor.fetchall()
    topic_ids = []
    for topic in topics:
        topic_ids.append(topic[3])
    return topic_ids


def download_rss_data(config):
    rss_links = get_rss_links(config)

    mongo_client = MongoClient("mongodb://" + config.contentDatabaseHost + ":27017/")
    mongo_db = mongo_client['content_database']
    news_collection = mongo_db['news']

    for rss_link in rss_links:
        feed = feedparser.parse(rss_link)
        for entry in feed.entries:
            article_object = {
                'title': entry['title'],
                'summary': entry['summary'].replace('\xa0', ' '),
                'timestamp': parser().parse(entry['published']).strftime("%Y-%m-%dT%H:%M:%SZ"),
                'url': entry['link'],
                'text': entry['title'] + ' ' + entry['summary'].replace('\xa0', ' '),
                'publisher': {'name': feed.feed['title'], 'url': feed.feed['title']},
                'language': feed.feed['language']
            }
            if news_collection.find({'url': entry['link']}).count() is 0:
                print(article_object)
                news_collection.insert_one(article_object)


if __name__ == '__main__':
    config = Config("localhost", "localhost", "localhost")
    download_rss_data(config)
