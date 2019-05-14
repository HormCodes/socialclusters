package com.socialclusters.api

import com.fasterxml.jackson.databind.ObjectMapper
import com.socialclusters.db.generated.user_database.Tables
import com.socialclusters.db.generated.user_database.tables.pojos.Topic
import com.socialclusters.domain.impl.*
import com.socialclusters.pojos.Author
import com.socialclusters.pojos.RedditPost
import com.socialclusters.pojos.Tweet
import com.socialclusters.pojos.WordCount
import io.kotlintest.Description
import io.kotlintest.specs.DescribeSpec
import org.hamcrest.Matchers
import org.jooq.DSLContext
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.core.ParameterizedTypeReference
import org.springframework.http.MediaType
import org.springframework.test.web.client.MockRestServiceServer
import org.springframework.test.web.client.match.MockRestRequestMatchers
import org.springframework.test.web.client.response.MockRestResponseCreators
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders
import org.springframework.test.web.servlet.result.MockMvcResultHandlers
import org.springframework.test.web.servlet.result.MockMvcResultMatchers
import org.springframework.web.client.RestTemplate


@SpringBootTest
@AutoConfigureMockMvc
class StatsControllerTest(
  val tweetRepository: TweetRepository,
  val redditPostRepository: RedditPostRepository,
  val facebookPostRepository: FacebookPostRepository,
  val newsRepository: NewsRepository,
  val mockMvc: MockMvc,
  val topicRepository: TopicRepository,
  val dslContext: DSLContext,
  val topicAnalysisServiceUrl: String,
  val restTemplate: RestTemplate
) : DescribeSpec() {


  val respType = object : ParameterizedTypeReference<List<WordCount>>() {}

  override fun beforeTest(description: Description) {

    listOf(tweetRepository, redditPostRepository, facebookPostRepository, newsRepository).forEach {
      it.deleteAll()
    }

    dslContext.deleteFrom(Tables.TOPIC).execute()


  }


  init {
    val tweet = Tweet(null, "lorem ipsum", "2019-01-16T20:42:48.000Z", "123", "en", 0, 0, Author("username", "Brno, Czech Republic", 0), listOf("culture"), null)
    val redditPost = RedditPost(null, "2019-01-15T20:42:48+00:00", listOf("traffic"), null, "lorem ipsum", "lorem ipsum", "lorem ipsum2", "author", "Brno", "...", 0, 0)

    val from = "2019-01-14T20:41:48.000Z"
    val to = "2019-01-18T20:42:48.000Z"

    describe("/stats/") {
      it("should return day counts for specified day") {

        val mockServer = MockRestServiceServer.createServer(restTemplate)
        mockServer.expect(MockRestRequestMatchers.requestTo("$topicAnalysisServiceUrl/wordcounts?from=$from&to=$to")).andRespond(MockRestResponseCreators.withSuccess(ObjectMapper().writeValueAsString(arrayOf(WordCount("lorem", 2), WordCount("ipsum", 2))), MediaType.APPLICATION_JSON))


        tweetRepository.insert(tweet)
        redditPostRepository.insert(redditPost)

        topicRepository.insert(Topic(null, "Culture", "culture"))
        topicRepository.insert(Topic(null, "Traffic", "traffic"))

        val request = MockMvcRequestBuilders.get("/stats/")
          .param("from", from)
          .param("to", to).header("Authorization", "Bearer " + getAccessToken(mockMvc))

        mockMvc
          .perform(request)
          .andDo(MockMvcResultHandlers.print())
          .andExpect(MockMvcResultMatchers.status().isOk)
          .andExpect(MockMvcResultMatchers.jsonPath("$.wordCounts[0].count", Matchers.`is`(2)))
          .andExpect(MockMvcResultMatchers.jsonPath("$.wordCounts[0].word", Matchers.`is`("lorem")))
          .andExpect(MockMvcResultMatchers.jsonPath("$.wordCounts[1].count", Matchers.`is`(2)))
          .andExpect(MockMvcResultMatchers.jsonPath("$.wordCounts[1].word", Matchers.`is`("ipsum")))
          .andExpect(MockMvcResultMatchers.jsonPath("$.dayCounts[1].count", Matchers.`is`(1)))
          .andExpect(MockMvcResultMatchers.jsonPath("$.dayCounts[2].count", Matchers.`is`(1)))
          .andExpect(MockMvcResultMatchers.jsonPath("$.withoutTopic", Matchers.`is`(0)))
          .andExpect(MockMvcResultMatchers.jsonPath("$.withSuggestedTopic", Matchers.`is`(0)))
          .andExpect(MockMvcResultMatchers.jsonPath("$.tweetAuthorCounts[0].author", Matchers.`is`("username")))
          .andExpect(MockMvcResultMatchers.jsonPath("$.redditAuthorCounts[0].author", Matchers.`is`("author")))
          .andExpect(MockMvcResultMatchers.jsonPath("$.newsPublisherCounts.length()", Matchers.`is`(0)))

      }
    }
  }
}
