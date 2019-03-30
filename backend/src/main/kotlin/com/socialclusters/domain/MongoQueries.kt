package com.socialclusters.domain

class MongoQueries {
  companion object {
    const val withoutTopics = "{\$or: [{'topics': {\$exists : false}}, {'topics': {\$eq: [] }}]}"
    const val containingTopics = "{ 'topics' : {\$in : ?0 }}"
    const val withSuggestedTopics = "{\$and: [{'suggestedTopics': {\$exists : true}}, {'suggestedTopics': {\$ne: [] }}]}"
  }
}
