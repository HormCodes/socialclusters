package com.socialclusters.pojos

data class TwitterSources(val accounts: List<String>, val hashtags: List<String>, val words: List<String>)

data class FacebookSources(val pages: List<String>, val groups: List<String>)

data class MeetupSources(val locations: List<String>)

data class RedditSources(val forums: List<String>)

data class NewsSources(val rss: List<String>)

data class Sources(
  val twitter: TwitterSources,
  val facebook: FacebookSources,
  val meetup: MeetupSources,
  val reddit: RedditSources,
  val news: NewsSources
)

