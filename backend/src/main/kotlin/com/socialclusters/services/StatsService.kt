package com.socialclusters.services

import com.socialclusters.domain.impl.*
import com.socialclusters.pojos.CountByTopic
import com.socialclusters.pojos.DayNumbers
import com.socialclusters.pojos.Post
import org.springframework.stereotype.Service
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
  private val topicRepository: TopicRepository
) {

  fun getDayCounts(from: String, to: String): List<DayNumbers> {
    // TODO - Check timestamps...

    val topics = topicRepository.findAll().toList().map { it.textId }.filterNotNull()

    val repositories = listOf(
      tweetRepository, newsRepository, redditPostRepository, facebookPostRepository
    )

    val posts = repositories.map { repository ->
      repository.findAll().map { it as Post } // TODO - MongoDB find by timestamp
    }.flatten()


    val days = getDaysBetweenRange(from, to)

    return days.map { day ->

      val postFromDay = posts.filter { post -> isInDateRange(post.timestamp, day.first.toString(), day.second.toString()) }
      val countsByTopic = topics.map { CountByTopic(it, postFromDay.filter { post -> post.topics.orEmpty().contains(it) }.size) }
      DayNumbers(day.first.toString(), postFromDay.size, countsByTopic)
    }

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
      val from = getDateObject(fromTimestamp)
      val to = getDateObject(toTimestamp)

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


