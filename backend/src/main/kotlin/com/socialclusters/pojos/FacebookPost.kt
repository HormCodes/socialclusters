package com.socialclusters.pojos

import org.springframework.data.annotation.Id
import org.springframework.data.mongodb.core.mapping.Document

@Document(collection = "facebook_posts")
class FacebookPost(
  @Id
  override var _id: String?,
  override var timestamp: String,
  override var topics: List<String>?, // TODO - Better immutable way of document update?
  override var suggestedTopics: List<String>?,
  val text: String,
  val postId: String,
  val reactions: Int,
  val comments: Int,
  val shares: Int
) : Post()
