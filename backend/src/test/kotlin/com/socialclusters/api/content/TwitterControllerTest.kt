package com.socialclusters.api.content

import com.socialclusters.domain.impl.TweetRepository
import com.socialclusters.pojos.Author
import com.socialclusters.pojos.Tweet
import io.kotlintest.Description
import io.kotlintest.matchers.collections.contain
import io.kotlintest.should
import io.kotlintest.shouldBe
import io.kotlintest.specs.DescribeSpec
import org.hamcrest.Matchers
import org.junit.runner.RunWith
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.http.MediaType
import org.springframework.test.context.junit4.SpringRunner
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders
import org.springframework.test.web.servlet.result.MockMvcResultHandlers
import org.springframework.test.web.servlet.result.MockMvcResultMatchers

@RunWith(SpringRunner::class)
@SpringBootTest
@AutoConfigureMockMvc
class TwitterControllerTest(
  private val mockMvc: MockMvc,
  private val tweetRepository: TweetRepository
) : DescribeSpec() {


  override fun beforeTest(description: Description) {
    tweetRepository.deleteAll()
  }

  init {
    describe("/contents/twitter") {
      context("GET") {
        it("should return all stored content from twitter as a page") {
          tweetRepository.insert(Tweet(null, "lorem ipsum", "Wed Jan 16 20:42:48 +0000 2019", "123", "en", 0, 0, Author("username", "Brno, Czech Republic", 0), null))


          mockMvc.perform(MockMvcRequestBuilders.get("/contents/twitter"))
            .andDo(MockMvcResultHandlers.print()).andExpect(MockMvcResultMatchers.status().isOk)
            .andExpect(MockMvcResultMatchers.jsonPath("$.content[0].text", Matchers.`is`("lorem ipsum")))
            .andExpect(MockMvcResultMatchers.jsonPath("$.content[0].tweetId", Matchers.`is`("123")))
        }

        it("should return stored content without topic from twitter as a page") {
          tweetRepository.insert(Tweet(null, "lorem ipsum", "Wed Jan 16 20:42:48 +0000 2019", "123", "en", 0, 0, Author("username", "Brno, Czech Republic", 0), null))
          tweetRepository.insert(Tweet(null, "lorem ipsum", "Wed Jan 16 20:42:48 +0000 2019", "124", "en", 0, 0, Author("username", "Brno, Czech Republic", 0), listOf("culture")))


          mockMvc.perform(MockMvcRequestBuilders.get("/contents/twitter").param("withoutTopic", "true"))
            .andDo(MockMvcResultHandlers.print()).andExpect(MockMvcResultMatchers.status().isOk)
            .andExpect(MockMvcResultMatchers.jsonPath("$.content.length()", Matchers.`is`(1)))
            .andExpect(MockMvcResultMatchers.jsonPath("$.content[0].text", Matchers.`is`("lorem ipsum")))
            .andExpect(MockMvcResultMatchers.jsonPath("$.content[0].tweetId", Matchers.`is`("123")))
            .andExpect(MockMvcResultMatchers.jsonPath("$.content[0].topics", Matchers.nullValue()))
        }

        it("should return stored content with topics specified as param from twitter as a page") {
          tweetRepository.insert(Tweet(null, "lorem ipsum", "Wed Jan 16 20:42:48 +0000 2019", "123", "en", 0, 0, Author("username", "Brno, Czech Republic", 0), null))
          tweetRepository.insert(Tweet(null, "lorem ipsum", "Wed Jan 16 20:42:48 +0000 2019", "124", "en", 0, 0, Author("username", "Brno, Czech Republic", 0), listOf("culture")))
          tweetRepository.insert(Tweet(null, "lorem ipsum", "Wed Jan 16 20:42:48 +0000 2019", "125", "en", 0, 0, Author("username", "Brno, Czech Republic", 0), listOf("traffic")))
          tweetRepository.insert(Tweet(null, "lorem ipsum", "Wed Jan 16 20:42:48 +0000 2019", "126", "en", 0, 0, Author("username", "Brno, Czech Republic", 0), listOf("traffic", "culture")))


          mockMvc.perform(MockMvcRequestBuilders.get("/contents/twitter").param("topics", "traffic,culture"))
            .andDo(MockMvcResultHandlers.print()).andExpect(MockMvcResultMatchers.status().isOk)
            .andExpect(MockMvcResultMatchers.jsonPath("$.content.length()", Matchers.`is`(3)))
        }



        it("should return stored content as a page of specified number elements") {
          tweetRepository.insert(Tweet(null, "lorem ipsum", "Wed Jan 16 20:42:48 +0000 2019", "123", "en", 0, 0, Author("username", "Brno, Czech Republic", 0), null))
          tweetRepository.insert(Tweet(null, "lorem ipsum", "Wed Jan 16 20:42:48 +0000 2019", "124", "en", 0, 0, Author("username", "Brno, Czech Republic", 0), listOf("culture")))
          tweetRepository.insert(Tweet(null, "lorem ipsum", "Wed Jan 16 20:42:48 +0000 2019", "125", "en", 0, 0, Author("username", "Brno, Czech Republic", 0), listOf("traffic")))
          tweetRepository.insert(Tweet(null, "lorem ipsum", "Wed Jan 16 20:42:48 +0000 2019", "126", "en", 0, 0, Author("username", "Brno, Czech Republic", 0), listOf("traffic", "culture")))


          mockMvc.perform(MockMvcRequestBuilders.get("/contents/twitter").param("size", "3"))
            .andDo(MockMvcResultHandlers.print()).andExpect(MockMvcResultMatchers.status().isOk)
            .andExpect(MockMvcResultMatchers.jsonPath("$.content.length()", Matchers.`is`(3)))
        }


      }


    }

    describe("/contents/twitter/{id}") {

      context("GET") {

        it("should return one existing tweet for specified id") {
          tweetRepository.insert(Tweet("5c3fa21b26582c07b6db3109", "lorem ipsum", "Wed Jan 16 20:42:48 +0000 2019", "124", "en", 0, 0, Author("username", "Brno, Czech Republic", 0), listOf("culture")))

          mockMvc.perform(MockMvcRequestBuilders.get("/contents/twitter/5c3fa21b26582c07b6db3109"))
            .andDo(MockMvcResultHandlers.print()).andExpect(MockMvcResultMatchers.status().isOk)
            .andExpect(MockMvcResultMatchers.jsonPath("$.text", Matchers.`is`("lorem ipsum")))

        }

        it("should return not found for non existing tweet for specified id") {
          tweetRepository.insert(Tweet("5c3fa21b26582c07b6db3109", "lorem ipsum", "Wed Jan 16 20:42:48 +0000 2019", "124", "en", 0, 0, Author("username", "Brno, Czech Republic", 0), listOf("culture")))

          mockMvc.perform(MockMvcRequestBuilders.get("/contents/twitter/123"))
            .andDo(MockMvcResultHandlers.print()).andExpect(MockMvcResultMatchers.status().isNotFound)

        }
      }

      context("DELETE") {
        it("should delete existing post") {
          tweetRepository.insert(Tweet("5c3fa21b26582c07b6db3109", "lorem ipsum", "Wed Jan 16 20:42:48 +0000 2019", "124", "en", 0, 0, Author("username", "Brno, Czech Republic", 0), listOf("culture")))
          tweetRepository.insert(Tweet("5c3fa21b26582c07b6db3110", "lorem ipsum", "Wed Jan 16 20:42:48 +0000 2019", "125", "en", 0, 0, Author("username", "Brno, Czech Republic", 0), listOf("traffic")))
          tweetRepository.insert(Tweet("5c3fa21b26582c07b6db3111", "lorem ipsum", "Wed Jan 16 20:42:48 +0000 2019", "126", "en", 0, 0, Author("username", "Brno, Czech Republic", 0), listOf("events")))

          mockMvc.perform(MockMvcRequestBuilders.delete("/contents/twitter/5c3fa21b26582c07b6db3109"))
            .andDo(MockMvcResultHandlers.print()).andExpect(MockMvcResultMatchers.status().isOk)

          tweetRepository.findAll().orEmpty().size shouldBe 2

        }
        it("should return not found for non existing post") {
          tweetRepository.insert(Tweet("5c3fa21b26582c07b6db3109", "lorem ipsum", "Wed Jan 16 20:42:48 +0000 2019", "124", "en", 0, 0, Author("username", "Brno, Czech Republic", 0), listOf("culture")))
          tweetRepository.insert(Tweet("5c3fa21b26582c07b6db3110", "lorem ipsum", "Wed Jan 16 20:42:48 +0000 2019", "125", "en", 0, 0, Author("username", "Brno, Czech Republic", 0), listOf("traffic")))
          tweetRepository.insert(Tweet("5c3fa21b26582c07b6db3111", "lorem ipsum", "Wed Jan 16 20:42:48 +0000 2019", "126", "en", 0, 0, Author("username", "Brno, Czech Republic", 0), listOf("events")))

          mockMvc.perform(MockMvcRequestBuilders.delete("/contents/twitter/123"))
            .andDo(MockMvcResultHandlers.print()).andExpect(MockMvcResultMatchers.status().isNotFound)

          tweetRepository.findAll().orEmpty().size shouldBe 3

        }
      }


    }

    describe("/contents/twitter/{id}/topics") {
      context("PATCH") {

        it("should add new topics which were empty before") {

          val id = "5c3fa21b26582c07b6db3109"
          tweetRepository.insert(Tweet(id, "lorem ipsum", "Wed Jan 16 20:42:48 +0000 2019", "124", "en", 0, 0, Author("username", "Brno, Czech Republic", 0), null))

          mockMvc.perform(MockMvcRequestBuilders.patch("/contents/twitter/5c3fa21b26582c07b6db3109/topics").contentType(MediaType.APPLICATION_JSON_UTF8).content("[\"culture\"]"))
            .andDo(MockMvcResultHandlers.print()).andExpect(MockMvcResultMatchers.status().isOk)

          tweetRepository.findById(id).get().topics.orEmpty() should contain("culture")

          tweetRepository.findAll().size shouldBe 1
        }

        it("should change to new topics and remove old") {

          val id = "5c3fa21b26582c07b6db3109"
          tweetRepository.insert(Tweet(id, "lorem ipsum", "Wed Jan 16 20:42:48 +0000 2019", "124", "en", 0, 0, Author("username", "Brno, Czech Republic", 0), listOf("traffic", "events")))

          mockMvc.perform(MockMvcRequestBuilders.patch("/contents/twitter/5c3fa21b26582c07b6db3109/topics").contentType(MediaType.APPLICATION_JSON_UTF8).content("[\"culture\"]"))
            .andDo(MockMvcResultHandlers.print()).andExpect(MockMvcResultMatchers.status().isOk)

          val topics = tweetRepository.findById(id).get().topics.orEmpty()
          topics should contain("culture")
          topics.size shouldBe 1

          tweetRepository.findAll().size shouldBe 1
        }



        it("should return not found for non existing tweet for specified id") {
          tweetRepository.insert(Tweet("5c3fa21b26582c07b6db3109", "lorem ipsum", "Wed Jan 16 20:42:48 +0000 2019", "124", "en", 0, 0, Author("username", "Brno, Czech Republic", 0), listOf("culture")))

          mockMvc.perform(MockMvcRequestBuilders.patch("/contents/twitter/123/topics").contentType(MediaType.APPLICATION_JSON_UTF8).content("[\"culture\"]"))
            .andDo(MockMvcResultHandlers.print()).andExpect(MockMvcResultMatchers.status().isNotFound)

        }

      }


    }
  }
}


