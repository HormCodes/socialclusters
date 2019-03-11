package com.socialclusters.pojos

import org.springframework.data.annotation.Id

class News(
  @Id
  val _id: String?,
  val title: String,
  val summary: String,
  val timestamp: String,
  val url: String,
  val language: String,
  val publisher: Publisher,
  var topics: List<String>? // TODO - Better immutable way of document update?
)

data class Publisher(
  val name: String,
  val url: String
)
