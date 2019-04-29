from flask import Flask, request

from facebook_data_to_mongo import download_facebook_data
from reddit_data_to_mongo import download_reddit_data
from rss_data_to_mongo import download_rss_data
from twitter_data_to_mongo import download_twitter_data

app = Flask(__name__)


@app.route('/data/twitter')
def data_twitter():
    download_twitter_data()

    return 'Done'


@app.route('/data/facebook')
def data_facebook():
    download_facebook_data(request.args.get('accessToken', ''))

    return 'Done'


@app.route('/data/reddit')
def data_reddit():
    download_reddit_data()

    return 'Done'


@app.route('/data/rss')
def data_rss():
    download_rss_data()

    return 'Done'


if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True)
