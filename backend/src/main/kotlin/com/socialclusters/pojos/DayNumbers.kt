package com.socialclusters.pojos

data class CountByTopic(val topic: String, val count: Int)

data class DayNumbers(val timestamp: String, val count: Int, val countsByTopic: List<CountByTopic>)
