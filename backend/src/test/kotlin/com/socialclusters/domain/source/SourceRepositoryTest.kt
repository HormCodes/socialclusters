package com.socialclusters.domain.source

import com.socialclusters.UserDatabaseInitializer
import com.socialclusters.configuration.UserDatabaseConfiguration
import com.socialclusters.domain.source.SourceRepository
import com.socialclusters.pojos.*
import io.kotlintest.shouldBe
import io.kotlintest.shouldNotBe
import io.kotlintest.specs.DescribeSpec
import org.junit.runner.RunWith
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.test.context.junit4.SpringRunner

@SpringBootTest // TODO - Not loading whole spring?
class SourceRepositoryTest(
  private val sourceRepository: SourceRepository
): DescribeSpec({
  describe("getAllTopics") {
    it("should return empty Sources object for empty tables") {
      val sources = Sources(
        TwitterSources(listOf(), listOf(), listOf()),
        FacebookSources(listOf(), listOf()),
        MeetupSources(listOf()),
        RedditSources(listOf()),
        NewsSources(listOf())
      )
      sourceRepository.getAllSources() shouldBe sources
    }
  }
})
