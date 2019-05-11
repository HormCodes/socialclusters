import datetime
import json
import majka
import os
import pickle
import time
from multiprocessing import Process

import psycopg2
from flask import Flask, jsonify, request

from pojo import Config
# from stats import get_word_cloud
from text_cleaning import get_text_for_predict_from_post, get_post_with_cleaned_text
from topic_classification import get_topics, suggest_topics, get_models
from wordcounts import get_word_counts

app = Flask(__name__)

models = None
last_training_timestamp = None
last_suggestion_timestamp = None

try:
    env = os.environ['ENV']
except:
    os.environ['ENV'] = 'dev'


def get_config(env):
    if env == "prod":
        return Config("backend", "content_database", "user_database")
    else:
        return Config("localhost", "localhost", "localhost")


config = get_config(os.environ['ENV'])


def load_models(config):
    global models
    models = []

    for topic in get_topics(config):
        topic_model = pickle.load(open('../models/' + topic + '_model.pkl', 'rb'))
        models.append({'topic': topic, 'model': topic_model})


@app.route('/wordcounts', methods=['GET'])
def wordcounts():
    now = datetime.datetime.now()
    week_ago = now - datetime.timedelta(days=7)
    return jsonify(
        get_word_counts(config, request.args.get('from', week_ago.isoformat()), request.args.get('to', now.isoformat()),
                        request.args.get('count', 100)))


def rest_of_training(id_of_new_row):
    start = time.time()
    connection = psycopg2.connect(user="postgres",
                                  password="postgres",
                                  host=config.userDatabaseHost,
                                  port="5432",
                                  database="user_database")
    models = get_models(config)
    print('Trained in %.1f seconds' % (time.time() - start))

    for model in models:
        pickle.dump(model['model'], open('../models/' + model['topic'] + '_model.pkl', 'wb'))

    cursor = connection.cursor()
    cursor.execute("UPDATE  training set is_done=%s, \"end\"=%s, accuracy=%s WHERE id=%s",
                   (True, datetime.datetime.now(), 42.0, id_of_new_row))
    connection.commit()


@app.route('/train', methods=['GET'])
def train():
    global models
    global last_training_timestamp
    # using random forest as an example
    # can do the training separately and just update the pickles

    connection = psycopg2.connect(user="postgres",
                                  password="postgres",
                                  host=config.userDatabaseHost,
                                  port="5432",
                                  database="user_database")
    cursor = connection.cursor()

    cursor.execute("INSERT INTO training (model_id, is_done, start) VALUES (%s,%s,%s) RETURNING id",
                   ("topic_analysis", False, datetime.datetime.now()))
    id_of_new_row = cursor.fetchone()[0]
    connection.commit()

    p = Process(target=rest_of_training, args=(id_of_new_row,))
    p.start()
    return str(id_of_new_row)




@app.route('/suggest')
def suggest():
    global models
    global last_suggestion_timestamp
    try:
        load_models(config)
        print('model loaded')

    except Exception as e:
        print('No model here')
        print('Train first')
        return 'Train first', 404

    if models:
        print('suggesting...')
        suggest_topics(config, models)

    last_suggestion_timestamp = int(time.time())

    return 'Done'


@app.route('/predict')
def predict():
    global models
    global last_suggestion_timestamp
    try:
        load_models(config)
        print('model loaded')

    except Exception as e:
        print('No model here')
        print('Train first')
        return 'Train first'

    data = json.loads(request.data)

    morph = majka.Majka("../majka/majka.w-lt")

    topics = []
    text = get_text_for_predict_from_post(
        data['platform'],
        get_post_with_cleaned_text(data['post'], morph),
        data['keysToSource']
    )

    print(text)
    if models:
        for model in models:
            if model['model'].predict([text])[0]:
                topics.append(model['topic'])

    return jsonify(topics)


if __name__ == '__main__':

    try:
        load_models(config)
        print('model loaded')

    except Exception as e:
        print('No model here')
        print('Train first')
        clf = None

    app.run(host='0.0.0.0', debug=True, port=5000)
