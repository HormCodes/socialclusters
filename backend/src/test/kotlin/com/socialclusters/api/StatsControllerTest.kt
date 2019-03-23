package com.socialclusters.api

import com.socialclusters.db.generated.user_database.Tables
import com.socialclusters.db.generated.user_database.tables.pojos.Topic
import com.socialclusters.domain.impl.*
import com.socialclusters.pojos.Author
import com.socialclusters.pojos.RedditPost
import com.socialclusters.pojos.Tweet
import io.kotlintest.Description
import io.kotlintest.specs.DescribeSpec
import org.hamcrest.Matchers
import org.jooq.DSLContext
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders
import org.springframework.test.web.servlet.result.MockMvcResultHandlers
import org.springframework.test.web.servlet.result.MockMvcResultMatchers

@SpringBootTest
@AutoConfigureMockMvc
class StatsControllerTest(
  val tweetRepository: TweetRepository,
  val redditPostRepository: RedditPostRepository,
  val facebookPostRepository: FacebookPostRepository,
  val newsRepository: NewsRepository,
  val mockMvc: MockMvc,
  val topicRepository: TopicRepository,
  val dslContext: DSLContext
) : DescribeSpec() {
  override fun beforeTest(description: Description) {

    listOf(tweetRepository, redditPostRepository, facebookPostRepository, newsRepository).forEach {
      it.deleteAll()
    }

    dslContext.deleteFrom(Tables.TOPIC).execute()

  }

  init {
    val tweet = Tweet(null, "lorem ipsum", "Wed Jan 16 20:42:48 +0000 2019", "123", "en", 0, 0, Author("username", "Brno, Czech Republic", 0), listOf("culture"), null)
    val redditPost = RedditPost(null, "1547584968", listOf("traffic"), null, "lorem ipsum", "lorem ipsum", "author", "Brno", "...", 0, 0)

    describe("/stats/day/topic") {
      it("should return day counts for specified day") {
        tweetRepository.insert(tweet)
        redditPostRepository.insert(redditPost)



        topicRepository.insert(Topic(null, "Culture", "culture"))
        topicRepository.insert(Topic(null, "Traffic", "traffic"))

        val request = MockMvcRequestBuilders.get("/stats/day/topic")
          .param("from", "Wed Jan 13 20:42:48 +0000 2019")
          .param("to", "Wed Jan 17 20:42:48 +0000 2019")

        mockMvc
          .perform(request)
          .andDo(MockMvcResultHandlers.print())
          .andExpect(MockMvcResultMatchers.status().isOk)
          .andExpect(MockMvcResultMatchers.jsonPath("$[2].count", Matchers.`is`(1)))
          .andExpect(MockMvcResultMatchers.jsonPath("$[3].count", Matchers.`is`(1)))

      }
    }
  }
}
