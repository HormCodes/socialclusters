package com.socialclusters.services

import com.socialclusters.db.generated.user_database.Tables
import com.socialclusters.db.generated.user_database.tables.pojos.Topic
import com.socialclusters.domain.impl.*
import com.socialclusters.pojos.*
import com.socialclusters.services.StatsService.Companion.getDateObject
import com.socialclusters.services.StatsService.Companion.getDay
import com.socialclusters.services.StatsService.Companion.getDaysBetweenRange
import com.socialclusters.services.StatsService.Companion.isInDateRange
import io.kotlintest.Description
import io.kotlintest.shouldBe
import io.kotlintest.specs.DescribeSpec
import org.jooq.DSLContext
import org.springframework.boot.test.context.SpringBootTest

@SpringBootTest
class StatsServiceTest(
  val statsService: StatsService,
  val tweetRepository: TweetRepository,
  val newsRepository: NewsRepository,
  val topicRepository: TopicRepository,
  val redditPostRepository: RedditPostRepository,
  val facebookPostRepository: FacebookPostRepository,
  val dslContext: DSLContext


) : DescribeSpec() {
  override fun beforeTest(description: Description) {
    listOf(tweetRepository, redditPostRepository, facebookPostRepository, newsRepository).forEach {
      it.deleteAll()
    }

    dslContext.deleteFrom(Tables.TOPIC).execute()
  }

  init {

    describe("getDateObject") {

      it("should return same date object from timestamp string of both types") {
        val firstTimestamp = "Wed Mar 7 07:20:00 +0000 2019"
        val secondTimestamp = "Wed, 07 Mar 2019 07:20:00 GMT"
        val thirdTimestamp = "Wed, 07 Mar 2019 08:20:00 +0100"


        val firstDate = getDateObject(firstTimestamp)
        val secondDate = getDateObject(secondTimestamp)
        val thirdDate = getDateObject(thirdTimestamp)

        firstDate shouldBe secondDate
        firstDate shouldBe thirdDate
        secondDate shouldBe thirdDate

      }

      it("for unix timestamp should return same date object") {
        getDateObject("1547584968") shouldBe getDateObject("Tue, 15 Jan 2019 20:42:48 GMT")
        getDateObject("1554449876") shouldBe getDateObject("Fri, 05 Apr 2019 07:37:56 GMT")
      }
    }

    describe("getDay") {

      it("should return pair of two date objects which is one at 0:00:00 and one at 23:59:59 for day from timestamp") {
        val timestamp = "Wed Mar 7 07:20:00 +0000 2019"

        val day = Pair(getDateObject("Wed Mar 7 00:00:00 +0000 2019"), getDateObject("Wed Mar 7 23:59:59 +0000 2019"))
        getDay(timestamp) shouldBe day

      }
    }

    describe("getDaysBetweenRange") {

      it("should return days between range") {
        val firstTimestamp = "Thu Mar 7 07:20:00 +0000 2019"
        val secondTimestamp = "Sun, 10 Mar 2019 07:20:00 GMT"

        val daysBetweenRange = getDaysBetweenRange(firstTimestamp, secondTimestamp)
        daysBetweenRange.size shouldBe 4
        daysBetweenRange.first().first shouldBe getDateObject("Wed Mar 07 00:00:00 +0000 2019")
      }
      it("should return days between unix range") {
        val firstTimestamp = "1553848676"
        val secondTimestamp = "1554449876"

        val daysBetweenRange = getDaysBetweenRange(firstTimestamp, secondTimestamp)
        daysBetweenRange.size shouldBe 8
        daysBetweenRange.first().first shouldBe getDateObject("Fri Mar 29 00:00:00 +0000 2019")
        daysBetweenRange.last().first shouldBe getDateObject("Fri Apr 05 00:00:00 +0000 2019")
      }

      it("should return day for single day") {
        val firstTimestamp = "Wed Mar 7 07:20:00 +0000 2019"
        val secondTimestamp = "Wed Mar 7 07:20:00 +0000 2019"

        val daysBetweenRange = getDaysBetweenRange(firstTimestamp, secondTimestamp)
        daysBetweenRange.size shouldBe 1
        daysBetweenRange.first().first shouldBe getDateObject("Wed Mar 07 00:00:00 +0000 2019")
      }


    }

    describe("getDayCounts") {
      it("should return special object with stats ") {

        topicRepository.insert(Topic(null, "Culture", "culture"))
        topicRepository.insert(Topic(null, "Traffic", "traffic"))

        tweetRepository.insert(Tweet(null, "lorem ipsum", "2019-01-13T20:42:48.000Z", "123", "en", 0, 0, Author("username", "Brno, Czech Republic", 0), null, null))
        tweetRepository.insert(Tweet(null, "lorem ipsum", "2019-01-14T20:42:48.000Z", "124", "en", 0, 0, Author("username", "Brno, Czech Republic", 0), listOf("culture"), null))
        tweetRepository.insert(Tweet(null, "lorem ipsum", "2019-01-15T20:42:48.000Z", "125", "en", 0, 0, Author("username", "Brno, Czech Republic", 0), listOf("traffic"), null))
        tweetRepository.insert(Tweet(null, "lorem ipsum", "2019-01-16T20:42:48.000Z", "126", "en", 0, 0, Author("username", "Brno, Czech Republic", 0), listOf("traffic", "culture"), null))

        statsService.getDayCounts("Wed Jan 14 20:41:48 +0000 2019", "Wed Jan 14 20:43:48 +0000 2019") shouldBe listOf(
          DayNumbers(
            "2019-01-14T00:00Z",
            1,
            listOf(CountByTopic("culture", 1), CountByTopic("traffic", 0)),
            listOf(CountByTopic("culture", 0), CountByTopic("traffic", 0)),
            listOf(CountByPlatform("twitter", 1), CountByPlatform("news", 0), CountByPlatform("reddit", 0), CountByPlatform("facebook", 0))
          )
        )
      }

      it("should return special object with stats also for reddit time format") {
        val tweet = Tweet(null, "lorem ipsum", "2019-01-16T20:42:48.000Z", "123", "en", 0, 0, Author("username", "Brno, Czech Republic", 0), listOf("culture"), null)
        val redditPost = RedditPost(null, "2019-01-15T20:42:48+00:00", listOf("traffic"), null, "lorem ipsum", "lorem ipsum", "", "author", "Brno", "...", 0, 0)

        tweetRepository.insert(tweet)
        redditPostRepository.insert(redditPost)

        topicRepository.insert(Topic(null, "Culture", "culture"))
        topicRepository.insert(Topic(null, "Traffic", "traffic"))

        val dayCounts = statsService.getDayCounts("Wed Jan 13 20:42:48 +0000 2019", "Wed Jan 17 20:42:48 +0000 2019")

        dayCounts.size shouldBe 5
        dayCounts[2].count shouldBe 1
        dayCounts[3].count shouldBe 1
      }

    }

    describe("isInDateRange") {

      it("should return true for date in date range") {

        isInDateRange("Wed Jan 13 20:42:48 +0000 2019", "Wed Jan 12 20:42:48 +0000 2019", "Wed Jan 15 20:42:48 +0000 2019") shouldBe true

        isInDateRange("1547584968", "Wed Jan 13 20:42:48 +0000 2019", "Wed Jan 17 20:42:48 +0000 2019") shouldBe true
      }

      it("should return false for date not in date range") {
        isInDateRange("Wed Jan 17 20:42:48 +0000 2019", "Wed Jan 12 20:42:48 +0000 2019", "Wed Jan 15 20:42:48 +0000 2019") shouldBe false
      }

    }

  }
}




