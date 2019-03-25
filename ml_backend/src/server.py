from flask import Flask

from twitter_data_to_mongo import download_twitter_data

app = Flask(__name__)


@app.route('/')
def hello_world():
    return 'Hello, World!'


@app.route('/data/twitter')
def data_twitter():
    download_twitter_data()

    return 'Done'


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')
