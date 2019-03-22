package com.socialclusters.api.content

import com.socialclusters.domain.impl.RedditPostRepository
import io.kotlintest.shouldBe
import io.kotlintest.specs.DescribeSpec
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.data.domain.PageRequest
import org.springframework.data.domain.Sort

@SpringBootTest
class RedditControllerTest(
  redditController: RedditController,
  redditPostRepository: RedditPostRepository
) : DescribeSpec({
  describe("getRedditContent") {
    it("should for request with order return ordered content") {
      val content = redditController.getTwitterContent(false, "", PageRequest(0, 20, Sort(Sort.Direction.DESC, "score")))
      println(content)

      val highestScore = redditPostRepository.findAll().toList().sortedByDescending { it.score }.first().score

      content.first().score shouldBe highestScore
    }
  }
})
