import pickle
import sys
import time

from flask import Flask, jsonify

from facebook_data_to_mongo import download_facebook_data
from reddit_data_to_mongo import download_reddit_data
from rss_data_to_mongo import download_rss_data
from topic_classification_use import get_models, get_topics, suggest_topics
from twitter_data_to_mongo import download_twitter_data

app = Flask(__name__)

models = None
last_training_timestamp = None
last_suggestion_timestamp = None


def load_models():
    global models
    models = []

    for topic in get_topics():
        topic_model = pickle.load(open('../models/' + topic + '_model.pkl', 'rb'))
        models.append({'topic': topic, 'model': topic_model})


@app.route('/')
def hello_world():
    return 'Hello, World!'


@app.route('/data/twitter')
def data_twitter():
    download_twitter_data()

    return 'Done'


@app.route('/data/facebook')
def data_facebook():
    download_facebook_data()

    return 'Done'


@app.route('/data/reddit')
def data_reddit():
    download_reddit_data()

    return 'Done'


@app.route('/data/rss')
def data_rss():
    download_rss_data()

    return 'Done'


@app.route('/model/train', methods=['GET'])
def train():
    global models
    global last_training_timestamp
    # using random forest as an example
    # can do the training separately and just update the pickles
    start = time.time()
    models = get_models()
    print('Trained in %.1f seconds' % (time.time() - start))

    for model in models:
        pickle.dump(model['model'], open('../models/' + model['topic'] + '_model.pkl', 'wb'))

    last_training_timestamp = int(time.time())

    return 'Success'


@app.route('/model/suggest')
def suggest():
    global models
    global last_suggestion_timestamp
    try:
        load_models()
        print('model loaded')

    except Exception as e:
        print('No model here')
        print('Train first')
        return 'Train first'

    if models:
        print('suggesting...')
        suggest_topics(models)

    last_suggestion_timestamp = int(time.time())

    return '42'


@app.route('/model/status')
def status():
    global models
    global last_suggestion_timestamp
    global last_training_timestamp

    try:
        load_models()
    except Exception as e:
        return jsonify({'isTrained': False, 'lastTrainingTimestamp': last_training_timestamp,
                        'lastSuggestionTimestamp': last_suggestion_timestamp})

    return jsonify({'isTrained': True, 'lastTrainingTimestamp': last_training_timestamp,
                    'lastSuggestionTimestamp': last_suggestion_timestamp})


if __name__ == '__main__':
    try:
        port = int(sys.argv[1])
    except Exception as e:
        port = 5000

    try:
        load_models()
        print('model loaded')

    except Exception as e:
        print('No model here')
        print('Train first')
        clf = None

    app.run(host='0.0.0.0', port=port, debug=True)
