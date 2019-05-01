package com.socialclusters.pojos

abstract class Post {
  abstract var _id: String?
  abstract var timestamp: String
  abstract var text: String
  abstract var topics: List<String>?
  abstract var suggestedTopics: List<String>?

}
