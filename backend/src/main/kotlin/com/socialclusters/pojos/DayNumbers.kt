package com.socialclusters.pojos

data class CountByAuthor(val author: String, val count: Int)
data class CountByTopic(val topic: String, val count: Int)
data class CountByPlatform(val platform: String, val count: Int)

data class DayNumbers(val timestamp: String, val count: Int, val countsByTopic: List<CountByTopic>, val countsBySuggestedTopic: List<CountByTopic>, val countsByPlatform: List<CountByPlatform>)
