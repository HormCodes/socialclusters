package com.socialclusters.pojos

import org.springframework.data.annotation.Id

class Tweet(
  @Id
  val _id: String?,
  val text: String,
  val timestamp: String,
  val tweetId: String,
  val language: String,
  val retweets: Int,
  val favourites: Int,
  val author: Author,
  var topics: List<String>? // TODO - Better immutable way of document update?
)

data class Author(
  val username: String,
  val location: String,
  val followers: Int
)
