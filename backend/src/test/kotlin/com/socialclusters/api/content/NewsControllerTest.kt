package com.socialclusters.api.content

import com.socialclusters.domain.impl.NewsRepository
import com.socialclusters.pojos.News
import com.socialclusters.pojos.Publisher
import io.kotlintest.Description
import io.kotlintest.specs.DescribeSpec
import org.hamcrest.Matchers
import org.junit.runner.RunWith
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.test.context.junit4.SpringRunner
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders
import org.springframework.test.web.servlet.result.MockMvcResultHandlers
import org.springframework.test.web.servlet.result.MockMvcResultMatchers

@RunWith(SpringRunner::class)
@SpringBootTest
@AutoConfigureMockMvc
class NewsControllerTest(
  private val mockMvc: MockMvc,
  private val newsRepository: NewsRepository
) : DescribeSpec() {


  override fun beforeTest(description: Description) {
    newsRepository.deleteAll()
  }

  init {

    describe("/contents/news/") {

      context("GET") {
        it("should return news as page") {
          val news = News("5c3fa21b26582c07b6db3109",
            "Title",
            "Summary",
            "...",
            "Sun, 10 Mar 2019 19:20:00 GMT",
            "url", "cs",
            Publisher("Publisher", "url2"),
            listOf(), null)
          newsRepository.insert(news)

          mockMvc.perform(MockMvcRequestBuilders.get("/contents/news"))
            .andDo(MockMvcResultHandlers.print()).andExpect(MockMvcResultMatchers.status().isOk)
            .andExpect(MockMvcResultMatchers.jsonPath("$.content[0].title", Matchers.`is`("Title")))
            .andExpect(MockMvcResultMatchers.jsonPath("$.content[0].url", Matchers.`is`("url")))
        }

        it("should return news without topics as page") {


          val news = News("5c3fa21b26582c07b6db3109",
            "Title",
            "Summary",
            "...",
            "Sun, 10 Mar 2019 19:20:00 GMT",
            "url", "cs",
            Publisher("Publisher", "url2"),
            null, null)
          newsRepository.insert(news)


          val newsWithTopics = News("5c3fa21b26582c07b6db3110",
            "Title2",
            "Summary",
            "...",
            "Sun, 10 Mar 2019 19:20:00 GMT",
            "url", "cs",
            Publisher("Publisher", "url2"),
            listOf("culture"), null)
          newsRepository.insert(newsWithTopics)


          val newsWithEmptyTopics = News("5c3fa21b26582c07b6db3111",
            "Title3",
            "Summary",
            "...",
            "Sun, 10 Mar 2019 19:20:00 GMT",
            "url", "cs",
            Publisher("Publisher", "url2"),
            listOf(), null)
          newsRepository.insert(newsWithEmptyTopics)

          mockMvc.perform(MockMvcRequestBuilders.get("/contents/news").param("withoutTopic", "true"))
            .andDo(MockMvcResultHandlers.print()).andExpect(MockMvcResultMatchers.status().isOk)
            .andExpect(MockMvcResultMatchers.jsonPath("$.content.length()", Matchers.`is`(2)))
            .andExpect(MockMvcResultMatchers.jsonPath("$.content[0].title", Matchers.`is`("Title")))
        }
      }

    }
  }
}


