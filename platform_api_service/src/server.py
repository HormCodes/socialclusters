import os

from flask import Flask, request

from facebook_data_to_mongo import download_facebook_data
from pojo import Config
from reddit_data_to_mongo import download_reddit_data
from rss_data_to_mongo import download_rss_data
from twitter_data_to_mongo import download_twitter_data

app = Flask(__name__)


def get_config(env):
    if env == "prod":
        return Config("backend", "content_database", "user_database")
    else:
        return Config("localhost", "localhost", "localhost")


config = get_config(os.environ['ENV'])


@app.route('/twitter')
def data_twitter():
    download_twitter_data(config)

    return 'Done'


@app.route('/facebook')
def data_facebook():
    download_facebook_data(config, request.args.get('accessToken', ''))

    return 'Done'


@app.route('/reddit')
def data_reddit():
    download_reddit_data(config)

    return 'Done'


@app.route('/news')
def data_rss():
    download_rss_data(config)

    return 'Done'


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=6000, debug=True)
