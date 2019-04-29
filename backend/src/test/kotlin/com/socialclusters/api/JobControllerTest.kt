package com.socialclusters.api

import com.socialclusters.domain.impl.NewsRepository
import com.socialclusters.domain.impl.TweetRepository
import com.socialclusters.pojos.Author
import com.socialclusters.pojos.News
import com.socialclusters.pojos.Publisher
import com.socialclusters.pojos.Tweet
import io.kotlintest.Description
import io.kotlintest.shouldBe
import io.kotlintest.specs.DescribeSpec
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders
import org.springframework.test.web.servlet.result.MockMvcResultHandlers
import org.springframework.test.web.servlet.result.MockMvcResultMatchers

@SpringBootTest
@AutoConfigureMockMvc
class JobControllerTest(
  val tweetRepository: TweetRepository,
  val newsRepository: NewsRepository,
  private val mockMvc: MockMvc
) : DescribeSpec() {
  override fun beforeTest(description: Description) {
    tweetRepository.deleteAll()
    newsRepository.deleteAll()
  }

  init {
    describe("/jobs/timestamps") {
      it("should update twitter timestamp format to ISO") {
        tweetRepository.insert(Tweet("12", "lorem ipsum", "Wed Jan 16 20:42:48 +0000 2019", "123", "en", 0, 0, Author("username", "Brno, Czech Republic", 0), null, null))

        mockMvc.perform(MockMvcRequestBuilders.post("/jobs/timestamps"))
          .andDo(MockMvcResultHandlers.print()).andExpect(MockMvcResultMatchers.status().isOk)

        tweetRepository.findById("12").get().timestamp shouldBe "2019-01-16T20:42:48Z"
      }

      it("should update news timestamp format to ISO") {
        newsRepository.insert(News("12", "lorem ipsum", "...", "...", "Wed, 06 Mar 2019 10:39:00 GMT", "", "en", Publisher("username", "Brno, Czech Republic"), null, null))
        newsRepository.insert(News("13", "lorem ipsum", "...", "...", "Sun, 10 Mar 2019 19:10:00 +0100", "", "en", Publisher("username", "Brno, Czech Republic"), null, null))

        mockMvc.perform(MockMvcRequestBuilders.post("/jobs/timestamps"))
          .andDo(MockMvcResultHandlers.print()).andExpect(MockMvcResultMatchers.status().isOk)

        newsRepository.findById("12").get().timestamp shouldBe "2019-03-06T10:39:00Z"
        newsRepository.findById("13").get().timestamp shouldBe "2019-03-10T18:10:00Z"
      }
    }
  }
}
