package com.socialclusters.services

import com.socialclusters.domain.impl.NewsRepository
import com.socialclusters.domain.impl.SourceRepository
import com.socialclusters.domain.impl.TopicRepository
import com.socialclusters.domain.impl.TweetRepository
import com.socialclusters.pojos.CountByTopic
import com.socialclusters.pojos.DayNumbers
import com.socialclusters.pojos.Post
import org.springframework.stereotype.Service
import java.text.SimpleDateFormat
import java.time.Instant
import java.util.*

@Service
class StatsService(

  private val tweetRepository: TweetRepository,
  private val newsRepository: NewsRepository,
  private val sourceRepository: SourceRepository,
  private val topicRepository: TopicRepository
) {

  fun getDayCounts(from: String, to: String): List<DayNumbers> {
    // TODO - Check timestamps...

    val topics = topicRepository.findAll().toList().map { it.textId }.filterNotNull()

    val repositories = listOf(
      tweetRepository, newsRepository
    )

    val posts = repositories.map { repository ->
      repository.findAll().map { it as Post } // TODO - MongoDB find by timestamp
    }.flatten()


    val days = listOf(
      Pair<Date, Date>(
        Date.from(Instant.parse(from)),
        Date.from(Instant.parse(to))
      )

    )

    return days.map { day ->

      val postFromDay = posts.filter { post -> isInDateRange(post.timestamp, day.first.toString(), day.second.toString()) }
      val countsByTopic = topics.map { CountByTopic(it, postFromDay.filter { post -> post.topics.orEmpty().contains(it) }.size) }
      DayNumbers(day.first.toString(), postFromDay.size, countsByTopic)
    }

  }

  private fun isInDateRange(timestamp: String, from: String, toString: String): Boolean {
    TODO("not implemented") //To change body of created functions use File | Settings | File Templates.
  }


  companion object {
    fun getDateObject(timestamp: String): Date {
      val possibleDateFormats = listOf("EEE MMM d HH:mm:ss Z yyyy", "yyyy.MM.dd G 'at' HH:mm:ss z", "EEE, MMM d, ''yy", "h:mm a", "hh 'o''clock' a, zzzz", "K:mm a, z", "yyyyy.MMMMM.dd GGG hh:mm aaa", "EEE, d MMM yyyy HH:mm:ss Z", "yyMMddHHmmssZ", "yyyy-MM-dd'T'HH:mm:ss.SSSZ", "yyyy-MM-dd'T'HH:mm:ss.SSSXXX", "YYYY-'W'ww-u", "EEE, dd MMM yyyy HH:mm:ss z", "EEE, dd MMM yyyy HH:mm zzzz", "yyyy-MM-dd'T'HH:mm:ssZ", "yyyy-MM-dd'T'HH:mm:ss.SSSzzzz", "yyyy-MM-dd'T'HH:mm:sszzzz", "yyyy-MM-dd'T'HH:mm:ss z", "yyyy-MM-dd'T'HH:mm:ssz", "yyyy-MM-dd'T'HH:mm:ss", "yyyy-MM-dd'T'HHmmss.SSSz", "yyyy-MM-dd", "yyyyMMdd", "dd/MM/yy", "dd/MM/yyyy")

      return possibleDateFormats.mapNotNull { format ->
        try {
          SimpleDateFormat(format, Locale.ENGLISH).parse(timestamp)

        } catch (exception: Exception) {
          null
        }

      }.first()

    }
  }

}


