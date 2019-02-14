package com.socialclusters.pojos

import org.bson.types.ObjectId
import org.springframework.data.annotation.Id

class Twitter(
  @Id
  val _id: ObjectId,
  val text: String,
  val timestamp: String,
  val id: Long,
  val language: String,
  val retweets: Int,
  val favourites: Int,
  val author: Author,
  val topics: List<String>?
)

data class Author(
  val username: String,
  val location: String,
  val followers: Int
)
