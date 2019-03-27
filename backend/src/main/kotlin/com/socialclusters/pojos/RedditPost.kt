package com.socialclusters.pojos

import org.springframework.data.annotation.Id
import org.springframework.data.mongodb.core.mapping.Document

@Document(collection = "reddit_posts")
class RedditPost(
  @Id
  override var _id: String?,
  override var timestamp: String,
  override var topics: List<String>?, // TODO - Better immutable way of document update?
  override var suggestedTopics: List<String>?,
  override var text: String,
  val title: String,
  val author: String,
  val subreddit: String,
  val permalink: String,
  val score: Int,
  val comments: Int
) : Post()
