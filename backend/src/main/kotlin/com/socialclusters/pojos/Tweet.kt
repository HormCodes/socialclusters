package com.socialclusters.pojos

import org.springframework.data.annotation.Id

class Tweet(
  @Id
  override var _id: String?,
  val text: String,
  override var timestamp: String,
  val tweetId: String,
  val language: String,
  val retweets: Int,
  val favourites: Int,
  val author: Author,
  override var topics: List<String>?, // TODO - Better immutable way of document update?
  override var suggestedTopics: List<String>?
) : Post()

data class Author(
  val username: String,
  val location: String,
  val followers: Int
)
