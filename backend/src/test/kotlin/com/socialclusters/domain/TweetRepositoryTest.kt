package com.socialclusters.domain

import com.socialclusters.configuration.ContentDatabaseConfiguration
import com.socialclusters.domain.impl.TweetRepository
import com.socialclusters.pojos.Author
import com.socialclusters.pojos.Tweet
import io.kotlintest.Description
import io.kotlintest.shouldBe
import io.kotlintest.specs.DescribeSpec
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.data.domain.PageRequest

@SpringBootTest(classes = [ContentDatabaseConfiguration::class, TweetRepository::class])
class TweetRepositoryTest(
  val tweetRepository: TweetRepository
) : DescribeSpec() {
  override fun beforeTest(description: Description) {
    tweetRepository.deleteAll()
  }

  init {
    describe("getPostsInDateRange") {
      it("should return page with posts with timestamp in range") {
        tweetRepository.insert(Tweet("1", "123", "2019-05-11T10:26:03+0000", "1", "cs", 10, 10, Author("", "", 0), null, null))
        tweetRepository.insert(Tweet("2", "123", "2019-05-11T10:20:03+0000", "2", "cs", 10, 10, Author("", "", 0), null, null))
        tweetRepository.insert(Tweet("3", "123", "2019-05-11T10:10:03+0000", "3", "cs", 10, 10, Author("", "", 0), null, null))

        tweetRepository.findByDateRange("2019-05-11T10:19:03+0000", "2019-05-11T10:27:03+0000", PageRequest.of(0, 20)).totalElements shouldBe 2
      }
      it("should return empty page  for range without posts") {
        tweetRepository.insert(Tweet("1", "123", "2019-05-11T10:26:03+0000", "1", "cs", 10, 10, Author("", "", 0), null, null))
        tweetRepository.insert(Tweet("2", "123", "2019-05-11T10:20:03+0000", "2", "cs", 10, 10, Author("", "", 0), null, null))
        tweetRepository.insert(Tweet("3", "123", "2019-05-11T10:10:03+0000", "3", "cs", 10, 10, Author("", "", 0), null, null))

        tweetRepository.findByDateRange("2019-05-11T12:19:03+0000", "2019-05-11T13:27:03+0000", PageRequest.of(0, 20)).totalElements shouldBe 0
      }
    }

  }
}
