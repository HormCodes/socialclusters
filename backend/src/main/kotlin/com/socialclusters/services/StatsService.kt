package com.socialclusters.services

import com.socialclusters.domain.impl.*
import com.socialclusters.pojos.*
import org.springframework.data.domain.PageRequest
import org.springframework.stereotype.Service
import org.springframework.web.client.RestTemplate
import java.text.SimpleDateFormat
import java.time.Instant
import java.time.OffsetDateTime
import java.time.ZoneOffset
import java.time.temporal.ChronoUnit
import java.util.*


@Service
class StatsService(

  private val tweetRepository: TweetRepository,
  private val redditPostRepository: RedditPostRepository,
  private val facebookPostRepository: FacebookPostRepository,
  private val newsRepository: NewsRepository,
  private val sourceRepository: SourceRepository,
  private val topicRepository: TopicRepository,
  private val topicAnalysisServiceUrl: String,
  private val restTemplate: RestTemplate
) {

  fun getTweetAuthorCounts(from: String, to: String): List<CountByAuthor> {
    val tweets = tweetRepository.findByDateRange(
      getDateObject(from).toString(),
      getDateObject(to).toString()
    )
    return getTweetAuthorCounts(tweets)
  }

  private fun getTweetAuthorCounts(tweets: List<Tweet>): List<CountByAuthor> {
    return tweets
      .map { it.author.username }
      .groupingBy { it }
      .eachCount()
      .map { CountByAuthor(it.key, it.value) }
      .sortedByDescending { it.count }
  }

  fun getNewsPublisherCounts(from: String, to: String): List<CountByAuthor> {
    return getNewsPublisherCounts(newsRepository.findByDateRange(getDateObject(from).toString(), getDateObject(to).toString()))
  }

  private fun getNewsPublisherCounts(news: List<News>): List<CountByAuthor> {
    return news
      .map { it.publisher.name }
      .groupingBy { it }
      .eachCount()
      .map { CountByAuthor(it.key, it.value) }
      .sortedByDescending { it.count }
  }

  fun getRedditAuthorCounts(from: String, to: String): List<CountByAuthor> {
    return getRedditAuthorCounts(redditPostRepository.findByDateRange(getDateObject(from).toString(), getDateObject(to).toString()))

  }

  private fun getRedditAuthorCounts(redditPosts: List<RedditPost>): List<CountByAuthor> {
    return redditPosts
      .map { it.author }
      .groupingBy { it }
      .eachCount()
      .map { CountByAuthor(it.key, it.value) }
      .sortedByDescending { it.count }
  }

  fun getWordCounts(from: String, to: String): List<WordCount> {
    return restTemplate.getForObject("$topicAnalysisServiceUrl/wordcounts?from=$from&to=$to", Array<WordCount>::class.java)?.toList()
      ?: listOf()
  }

  fun getDayCounts(from: String, to: String): List<DayCounts> {
    // TODO - Check timestamps...


    val platforms = listOf(
      Pair("twitter", tweetRepository), Pair("news", newsRepository), Pair("reddit", redditPostRepository), Pair("facebook", facebookPostRepository)
    )

    val posts = platforms.map { platform ->
      Pair(platform.first, platform.second.findByDateRange(getDateObject(from).toString(), getDateObject(to).toString()).map { it })
    }


    return getDayCounts(posts, from, to)

  }

  private fun getDayCounts(postsByPlatform: List<Pair<String, List<Post>>>, from: String, to: String): List<DayCounts> {
    // TODO - Check timestamps...

    val topics = topicRepository.findAll().toList().mapNotNull { it.textId }


    val days = getDaysBetweenRange(from, to)

    return days.map { day ->

      val postFromDay = postsByPlatform.map { Pair(it.first, it.second.filter { post -> isInDateRange(post.timestamp, day.first.toString(), day.second.toString()) }) }
      val countsByTopic = topics.map { CountByTopic(it, postFromDay.map { it.second }.flatten().filter { post -> post.topics.orEmpty().contains(it) }.size) }
      val countsBySuggestedTopic = topics.map { CountByTopic(it, postFromDay.map { it.second }.flatten().filter { post -> post.suggestedTopics.orEmpty().contains(it) }.size) }
      val countsByPlatform = postFromDay.map { CountByPlatform(it.first, it.second.size) }
      DayCounts(day.first.toString(), postFromDay.map { it.second }.flatten().size, countsByTopic, countsBySuggestedTopic, countsByPlatform)
    }

  }

  fun getWithoutTopicCount(): Long {
    val platforms = listOf(
      Pair("twitter", tweetRepository), Pair("news", newsRepository), Pair("reddit", redditPostRepository), Pair("facebook", facebookPostRepository)
    )

    return platforms.map { it.second.findWithoutTopics(PageRequest.of(0, 20)).totalElements }.sum()
  }

  fun getWithSuggestedTopicCount(): Long {
    val platforms = listOf(
      Pair("twitter", tweetRepository), Pair("news", newsRepository), Pair("reddit", redditPostRepository), Pair("facebook", facebookPostRepository)
    )

    return platforms.map { it.second.findWithSuggestedTopics(PageRequest.of(0, 20)).totalElements }.sum()
  }

  private fun getWithoutTopicCount(posts: List<Post>): Int {
    return posts.filter { it.topics == null || it.topics == listOf<String>() }.size
  }

  private fun getWithSuggestedTopicCount(posts: List<Post>): Int {
    return posts.filter { it.suggestedTopics != null && it.suggestedTopics != listOf<String>() }.size
  }

  fun getStats(from: String, to: String): Stats {
    val platforms = listOf(
      Pair("twitter", tweetRepository),
      Pair("news", newsRepository),
      Pair("reddit", redditPostRepository),
      Pair("facebook", facebookPostRepository)
    )

    val posts = platforms.map { platform ->
      Pair(
        platform.first,
        platform.second.findByDateRange(getDateObject(from).toString(), getDateObject(to).toString()).map { it }
      )
    }

    return Stats(
      getWordCounts(from, to),
      getDayCounts(posts, from, to),
      getTweetAuthorCounts(posts.toMap()["twitter"] as List<Tweet>),
      getRedditAuthorCounts(posts.toMap()["reddit"] as List<RedditPost>),
      getNewsPublisherCounts(posts.toMap()["news"] as List<News>),
      getWithoutTopicCount(posts.map { it.second }.flatten()),
      getWithSuggestedTopicCount(posts.map { it.second }.flatten())
    )
  }


  companion object {
    fun getDateObject(timestamp: String): OffsetDateTime {
      val possibleDateFormats = listOf(
        "EEE MMM d HH:mm:ss Z yyyy",
        "yyyy.MM.dd G 'at' HH:mm:ss z",
        "EEE, MMM d, ''yy",
        "h:mm a",
        "hh 'o''clock' a, zzzz",
        "K:mm a, z",
        "yyyyy.MMMMM.dd GGG hh:mm aaa",
        "EEE, d MMM yyyy HH:mm:ss Z",
        "yyyy-MM-dd'T'HH:mm:ss.SSSZ",
        "yyyy-MM-dd'T'HH:mm:ss.SSSXXX",
        "YYYY-'W'ww-u",
        "EEE, dd MMM yyyy HH:mm:ss z",
        "EEE, dd MMM yyyy HH:mm zzzz",
        "yyyy-MM-dd'T'HH:mm:ssZ",
        "yyyy-MM-dd'T'HH:mm:ss.SSSzzzz",
        "yyyy-MM-dd'T'HH:mm:sszzzz",
        "yyyy-MM-dd'T'HH:mm:ss z",
        "yyyy-MM-dd'T'HH:mm:ssz",
        "yyyy-MM-dd'T'HH:mm:ss",
        "yyyy-MM-dd'T'HHmmss.SSSz",
        "yyyy-MM-dd",
        "dd/MM/yy",
        "dd/MM/yyyy"

      )

      val convertedObjects = possibleDateFormats.mapNotNull { format ->
        try {
          SimpleDateFormat(format, Locale.ENGLISH).parse(timestamp).toInstant().atOffset(ZoneOffset.UTC)

        } catch (exception: Exception) {
          null
        }

      }

      return if (convertedObjects.isEmpty()) {
        Instant.ofEpochMilli(timestamp.toLong() * 1000L).atOffset(ZoneOffset.UTC)
      } else {
        convertedObjects.first()
      }

    }

    fun getDay(timestamp: String): Pair<OffsetDateTime, OffsetDateTime> {
      val date = getDateObject(timestamp)


      val dayStart = date.withHour(0).withMinute(0).withSecond(0)
      val dayEnd = date.withHour(23).withMinute(59).withSecond(59)

      return Pair(dayStart, dayEnd)
    }

    fun getDaysBetweenRange(fromTimestamp: String, toTimestamp: String): List<Pair<OffsetDateTime, OffsetDateTime>> {
      val from = getDateObject(fromTimestamp).withHour(0).withMinute(0).withSecond(0)
      val to = getDateObject(toTimestamp).withHour(0).withMinute(0).withSecond(0)

      val numOfDaysBetween = ChronoUnit.DAYS.between(from, to)
      return (0..numOfDaysBetween).map {
        val day = from.plusDays(it)
        Pair(day.withHour(0).withMinute(0).withSecond(0), day.withHour(23).withMinute(59).withSecond(59))
      }.toList()

    }

    fun isInDateRange(timestamp: String, from: String, to: String): Boolean {
      val date = getDateObject(timestamp)
      return getDateObject(from).toEpochSecond() <= date.toEpochSecond() && date.toEpochSecond() <= getDateObject(to).toEpochSecond()
    }


  }

}


