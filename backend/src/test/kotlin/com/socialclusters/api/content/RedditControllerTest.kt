package com.socialclusters.api.content

import com.socialclusters.domain.impl.RedditPostRepository
import com.socialclusters.pojos.RedditPost
import io.kotlintest.Description
import io.kotlintest.shouldBe
import io.kotlintest.specs.DescribeSpec
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.data.domain.PageRequest
import org.springframework.data.domain.Sort

@SpringBootTest
class RedditControllerTest(
  redditController: RedditController,
  val redditPostRepository: RedditPostRepository
) : DescribeSpec() {
  override fun beforeTest(description: Description) {
    redditPostRepository.deleteAll()
  }

  init {
    describe("getRedditContent") {
      it("should for request with order return ordered content") {
        redditPostRepository.insert(RedditPost("123", "123", null, null, "", "", "", "", "", "", 0, 0))
        redditPostRepository.insert(RedditPost("124", "123", null, null, "", "", "", "", "", "", 1, 0))

        val content = redditController.getContent(false, "", PageRequest(0, 20, Sort(Sort.Direction.DESC, "score")))
        println(content)

        val highestScore = redditPostRepository.findAll().toList().sortedByDescending { it.score }.first().score

        content.first().score shouldBe highestScore
      }
    }
  }
}
