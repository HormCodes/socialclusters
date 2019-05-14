package com.socialclusters.api

import com.socialclusters.db.generated.user_database.Tables.TOPIC
import com.socialclusters.db.generated.user_database.tables.daos.TopicDao
import com.socialclusters.db.generated.user_database.tables.pojos.Topic
import com.socialclusters.utils.toJsonString
import com.socialclusters.utils.withoutId
import io.kotlintest.Description
import io.kotlintest.shouldBe
import io.kotlintest.specs.DescribeSpec
import org.hamcrest.Matchers
import org.jooq.DSLContext
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
class TopicControllerTest(
  val mockMvc: MockMvc,
  val dslContext: DSLContext,
  val topicDao: TopicDao
) : DescribeSpec() {

  override fun beforeTest(description: Description) {
    dslContext.deleteFrom(TOPIC).execute()
  }

  init {

    val name = "Culture"
    val textId = "culture"

    describe("/topics") {
      context("GET") {

        it("for call without param should return list of topic entries") {

          topicDao.insert(listOf(Topic().withoutId(name, textId)))

          mockMvc.perform(MockMvcRequestBuilders.get("/topics").header("Authorization", "Bearer " + getAccessToken(mockMvc)))
            .andDo(MockMvcResultHandlers.print()).andExpect(MockMvcResultMatchers.status().isOk)
            .andExpect(MockMvcResultMatchers.jsonPath("$[0].id", Matchers.notNullValue()))
            .andExpect(MockMvcResultMatchers.jsonPath("$[0].textId", Matchers.`is`(textId)))
            .andExpect(MockMvcResultMatchers.jsonPath("$[0].name", Matchers.`is`(name)))
        }
      }

      context("POST") {
        it("should create new topic") {
          val topic = Topic().withoutId(name, textId)
          val request = MockMvcRequestBuilders.post("/topics").contentType(MediaType.APPLICATION_JSON_UTF8).content(topic.toJsonString()).header("Authorization", "Bearer " + getAccessToken(mockMvc))
          mockMvc.perform(request)
            .andDo(MockMvcResultHandlers.print()).andExpect(MockMvcResultMatchers.status().isOk)
            .andExpect(MockMvcResultMatchers.jsonPath("$.id", Matchers.notNullValue()))
            .andExpect(MockMvcResultMatchers.jsonPath("$.textId", Matchers.`is`(textId)))
            .andExpect(MockMvcResultMatchers.jsonPath("$.name", Matchers.`is`(name)))

          topicDao.findAll().size shouldBe 1
        }
        it("should return for existing topic json") {

          val topic = Topic(8, name, textId)

          topicDao.insert(topic)

          val request = MockMvcRequestBuilders.post("/topics").contentType(MediaType.APPLICATION_JSON_UTF8).content(topic.toJsonString()).header("Authorization", "Bearer " + getAccessToken(mockMvc))
          mockMvc.perform(request)
            .andDo(MockMvcResultHandlers.print()).andExpect(MockMvcResultMatchers.status().isConflict)
        }

        it("should create new topic for json without id field") {
          val topic = Topic().withoutId(name, textId)
          val request = MockMvcRequestBuilders.post("/topics").contentType(MediaType.APPLICATION_JSON_UTF8).content("{\"name\":\"$name\",\"textId\":\"$textId\"}").header("Authorization", "Bearer " + getAccessToken(mockMvc))
          mockMvc.perform(request)
            .andDo(MockMvcResultHandlers.print()).andExpect(MockMvcResultMatchers.status().isOk)
            .andExpect(MockMvcResultMatchers.jsonPath("$.id", Matchers.notNullValue()))
            .andExpect(MockMvcResultMatchers.jsonPath("$.textId", Matchers.`is`(textId)))
            .andExpect(MockMvcResultMatchers.jsonPath("$.name", Matchers.`is`(name)))

          topicDao.findAll().size shouldBe 1
        }

      }

    }




    describe("/topics/{id}") {

      context("GET") {
        it("for  existing id should return topic entry") {
          topicDao.insert(listOf(Topic(9, name, textId)))

          mockMvc.perform(MockMvcRequestBuilders.get("/topics/9").header("Authorization", "Bearer " + getAccessToken(mockMvc)))
            .andDo(MockMvcResultHandlers.print()).andExpect(MockMvcResultMatchers.status().isOk)
        }

        it("for non existing id GET should return not found") {
          mockMvc.perform(MockMvcRequestBuilders.get("/topics/9").header("Authorization", "Bearer " + getAccessToken(mockMvc)))
            .andDo(MockMvcResultHandlers.print()).andExpect(MockMvcResultMatchers.status().isNotFound)
        }
      }

      context("PUT") {
        it("should return conflict code if content has id different from path variable") {
          topicDao.insert(listOf(Topic(9, name, textId)))

          val topic = Topic(8, name, textId)

          val request = MockMvcRequestBuilders.put("/topics/9").contentType(MediaType.APPLICATION_JSON_UTF8).content(topic.toJsonString()).header("Authorization", "Bearer " + getAccessToken(mockMvc))
          mockMvc.perform(request)
            .andDo(MockMvcResultHandlers.print()).andExpect(MockMvcResultMatchers.status().isConflict)


        }

        it("should update existing topic") {
          topicDao.insert(listOf(Topic(9, name, textId)))

          val topic = Topic(9, "Kultura", textId)

          val request = MockMvcRequestBuilders.put("/topics/9").contentType(MediaType.APPLICATION_JSON_UTF8).content(topic.toJsonString()).header("Authorization", "Bearer " + getAccessToken(mockMvc))
          mockMvc.perform(request)
            .andDo(MockMvcResultHandlers.print()).andExpect(MockMvcResultMatchers.status().isOk)
            .andExpect(MockMvcResultMatchers.jsonPath("$.id", Matchers.notNullValue()))
            .andExpect(MockMvcResultMatchers.jsonPath("$.textId", Matchers.`is`(textId)))
            .andExpect(MockMvcResultMatchers.jsonPath("$.name", Matchers.`is`("Kultura")))


          topicDao.findById(9).name shouldBe "Kultura"


        }

        it("should create non existing topic") {

          val topic = Topic(9, name, textId)

          val request = MockMvcRequestBuilders.put("/topics/9").contentType(MediaType.APPLICATION_JSON_UTF8).content(topic.toJsonString()).header("Authorization", "Bearer " + getAccessToken(mockMvc))
          mockMvc.perform(request)
            .andDo(MockMvcResultHandlers.print()).andExpect(MockMvcResultMatchers.status().isOk)
            .andExpect(MockMvcResultMatchers.jsonPath("$.id", Matchers.notNullValue()))
            .andExpect(MockMvcResultMatchers.jsonPath("$.textId", Matchers.`is`(textId)))
            .andExpect(MockMvcResultMatchers.jsonPath("$.name", Matchers.`is`(name)))


          topicDao.findAll().size shouldBe 1
          topicDao.findById(9).name shouldBe "Culture"


        }
      }

      context("DELETE") {

        it("should throw not found for not existing topic") {
          mockMvc.perform(MockMvcRequestBuilders.delete("/topics/9").header("Authorization", "Bearer " + getAccessToken(mockMvc)))
            .andDo(MockMvcResultHandlers.print()).andExpect(MockMvcResultMatchers.status().isNotFound)
        }

        it("should delete existing topic") {
          topicDao.insert(listOf(Topic(9, name, textId)))

          mockMvc.perform(MockMvcRequestBuilders.delete("/topics/9").header("Authorization", "Bearer " + getAccessToken(mockMvc)))
            .andDo(MockMvcResultHandlers.print()).andExpect(MockMvcResultMatchers.status().isOk)

          topicDao.findAll().size shouldBe 0
        }
      }
    }


  }
}

