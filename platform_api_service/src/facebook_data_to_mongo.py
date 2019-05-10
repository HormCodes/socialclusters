# TODO - Facebook data to mongo
import json

import psycopg2
import requests
from dateutil.parser import parser
from pymongo import MongoClient

from pojo import Config

CONFIG_JSON_FILE_NAME = "../config.json"
FACEBOOK_KEY = "facebook"


def get_facebook_access_token(facebook_keys):
    return facebook_keys["userAccessToken"]


def get_facebook_keys(config):
    return config["keys"][FACEBOOK_KEY]


# TODO - Test
def get_facebook_pages(config):
    connection = psycopg2.connect(user="postgres",
                                  password="postgres",
                                  host=config.userDatabaseHost,
                                  port="5432",
                                  database="user_database")
    cursor = connection.cursor()
    cursor.execute("select * from source where platform='facebook'")
    topics = cursor.fetchall()
    topic_ids = []
    for topic in topics:
        topic_ids.append(topic[3])
    return topic_ids


def download_facebook_data(config, access_token):
    facebook_pages = get_facebook_pages(config)

    facebook_access_token = access_token

    facebook_posts = []

    for page in facebook_pages:
        session = requests.session()
        session.params = {'access_token': facebook_access_token,
                          'fields': 'created_time,shares,id,story,message,comments.limit(0).summary(true),reactions.limit(0).summary(total_count)'}
        response = session.get("https://graph.facebook.com/v3.2/" + page + "/feed")
        results = json.loads(response.content)
        facebook_posts.extend(results['data'])

    mongo_client = MongoClient("mongodb://" + config.contentDatabaseHost + ":27017/")
    mongo_db = mongo_client['content_database']
    facebook_collection = mongo_db['facebook_posts']

    for post in facebook_posts:
        try:
            post["shares"]
        except KeyError:
            shares = 0
        else:
            shares = post["shares"]['count']

        try:
            post["message"]
        except KeyError:
            message = ""
        else:
            message = post["message"]

        if facebook_collection.find(
            {'timestamp': parser().parse(post['created_time']).strftime("%Y-%m-%dT%H:%M:%SZ"),
             'text': message}).count() is 0 and message is not "":
            post_object = {
                'text': message,
                'timestamp': post['created_time'],
                'postId': post['id'],
                'reactions': post['reactions']['summary']['total_count'],
                'comments': post['comments']['summary']['total_count'],
                'shares': shares,
            }

            facebook_collection.insert_one(post_object)


if __name__ == '__main__':
    print('Enter access token:')
    access_token = input()
    config = Config("localhost", "localhost", "localhost")
    download_facebook_data(config, access_token)
