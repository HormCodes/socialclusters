import json

from pymongo import MongoClient

mongo_client = MongoClient("mongodb://localhost:27017/")
mongo_db = mongo_client['content_database']
twitter_collection = mongo_db['twitter']

documents = twitter_collection.find({})




def delete_without_topics():
    for document in documents:
        print(document)
        for to_remove in twitter_collection.find({'text': document['text'], 'timestamp': document['timestamp']}):
            try:
                topics = to_remove['topics']
            except:
                twitter_collection.delete_one({'_id': to_remove['_id']})

    print(documents.count())

def delete_duplicity():
    for document in documents:
        print(document)
        cursor = twitter_collection.find({'text': document['text'], 'timestamp': document['timestamp']})
        count = cursor.count()
        deleted = 0
        for to_remove in cursor:
            if deleted is not count - 1:
                twitter_collection.delete_one({'_id': to_remove['_id']})
                deleted += 1

    print(documents.count())

delete_duplicity()
