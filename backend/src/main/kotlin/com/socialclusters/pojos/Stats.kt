package com.socialclusters.pojos

import com.fasterxml.jackson.annotation.JsonIgnoreProperties


data class CountByAuthor(val author: String, val count: Int)

@JsonIgnoreProperties(ignoreUnknown = true)
data class WordCount(val word: String = "", val count: Int = 0)
data class CountByTopic(val topic: String, val count: Int)
data class CountByPlatform(val platform: String, val count: Int)

data class DayCounts(val timestamp: String, val count: Int, val countsByTopic: List<CountByTopic>, val countsBySuggestedTopic: List<CountByTopic>, val countsByPlatform: List<CountByPlatform>)


data class Stats(
  val wordCounts: List<WordCount>,
  val dayCounts: List<DayCounts>,
  val tweetAuthorCounts: List<CountByAuthor>,
  val redditAuthorCounts: List<CountByAuthor>,
  val newsPublisherCounts: List<CountByAuthor>,
  val withoutTopic: Int,
  val withSuggestedTopic: Int
)
