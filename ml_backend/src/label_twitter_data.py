from pymongo import MongoClient

mongo_client = MongoClient("mongodb://localhost:27017/")
mongo_db = mongo_client['content_database']
twitter_collection = mongo_db['twitter']

documents = twitter_collection.find({})

for document in documents:
    print(document['text'])
    try:
        print(document['topics'])
    except:
        print('No topics')
    topic = input('Enter topic ID:')

    if topic is not "":
        twitter_collection.update_one(document, {'$addToSet': {'topics': topic}})

