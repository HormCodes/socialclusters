import json

from pymongo import MongoClient

mongo_client = MongoClient("mongodb://localhost:27017/")
mongo_db = mongo_client['content_database']
twitter_collection = mongo_db['twitter']

documents = twitter_collection.find({})

for document in documents:
    print(document)

print(documents.count())


