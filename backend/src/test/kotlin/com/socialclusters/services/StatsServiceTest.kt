package com.socialclusters.services

import com.socialclusters.db.generated.user_database.Tables
import com.socialclusters.db.generated.user_database.tables.pojos.Topic
import com.socialclusters.domain.impl.NewsRepository
import com.socialclusters.domain.impl.TopicRepository
import com.socialclusters.domain.impl.TweetRepository
import com.socialclusters.pojos.Author
import com.socialclusters.pojos.CountByTopic
import com.socialclusters.pojos.DayNumbers
import com.socialclusters.pojos.Tweet
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
  val dslContext: DSLContext


) : DescribeSpec() {
  override fun beforeTest(description: Description) {
    tweetRepository.deleteAll()
    newsRepository.deleteAll()
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
        val firstTimestamp = "Wed Mar 7 07:20:00 +0000 2019"
        val secondTimestamp = "Wed, 10 Mar 2019 07:20:00 GMT"

        val daysBetweenRange = getDaysBetweenRange(firstTimestamp, secondTimestamp)
        daysBetweenRange.size shouldBe 4
        daysBetweenRange.first().first shouldBe getDateObject("Wed Mar 07 00:00:00 +0000 2019")
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

        tweetRepository.insert(Tweet(null, "lorem ipsum", "Wed Jan 13 20:42:48 +0000 2019", "123", "en", 0, 0, Author("username", "Brno, Czech Republic", 0), null, null))
        tweetRepository.insert(Tweet(null, "lorem ipsum", "Wed Jan 14 20:42:48 +0000 2019", "124", "en", 0, 0, Author("username", "Brno, Czech Republic", 0), listOf("culture"), null))
        tweetRepository.insert(Tweet(null, "lorem ipsum", "Wed Jan 15 20:42:48 +0000 2019", "125", "en", 0, 0, Author("username", "Brno, Czech Republic", 0), listOf("traffic"), null))
        tweetRepository.insert(Tweet(null, "lorem ipsum", "Wed Jan 16 20:42:48 +0000 2019", "126", "en", 0, 0, Author("username", "Brno, Czech Republic", 0), listOf("traffic", "culture"), null))

        statsService.getDayCounts("Wed Jan 14 20:42:48 +0000 2019", "Wed Jan 14 20:42:48 +0000 2019") shouldBe listOf(DayNumbers("2019-01-14T00:00Z", 1, listOf(CountByTopic("culture", 1), CountByTopic("traffic", 0))))
      }

    }

    describe("isInDateRange") {

      isInDateRange("Wed Jan 13 20:42:48 +0000 2019", "Wed Jan 12 20:42:48 +0000 2019", "Wed Jan 15 20:42:48 +0000 2019") shouldBe true
      isInDateRange("Wed Jan 17 20:42:48 +0000 2019", "Wed Jan 12 20:42:48 +0000 2019", "Wed Jan 15 20:42:48 +0000 2019") shouldBe false
    }

  }
}




