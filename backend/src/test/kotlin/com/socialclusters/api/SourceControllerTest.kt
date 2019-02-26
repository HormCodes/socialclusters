package com.socialclusters.api

import com.beust.klaxon.Klaxon
import com.socialclusters.db.generated.user_database.Tables
import com.socialclusters.db.generated.user_database.tables.daos.SourceDao
import com.socialclusters.db.generated.user_database.tables.pojos.Source
import com.socialclusters.pojos.Sources
import com.socialclusters.utils.toJsonString
import com.socialclusters.utils.withoutId
import io.kotlintest.Description
import io.kotlintest.matchers.collections.shouldContain
import io.kotlintest.shouldBe
import io.kotlintest.specs.DescribeSpec
import org.hamcrest.Matchers.`is`
import org.hamcrest.Matchers.notNullValue
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
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath

@RunWith(SpringRunner::class)
@SpringBootTest
@AutoConfigureMockMvc
class SourceControllerTest(
  val mockMvc: MockMvc,
  val dslContext: DSLContext,
  val sourceDao: SourceDao
) : DescribeSpec() {

  override fun beforeTest(description: Description) {
    dslContext.deleteFrom(Tables.SOURCE).execute()
  }

  init {

    val platform = "twitter"
    val valueType = "account"
    val value = "username"

    describe("/sources") {
      context("GET") {

        it("for call without param should return list of source entries") {

          sourceDao.insert(listOf(Source().withoutId(platform, valueType, value)))

          mockMvc.perform(MockMvcRequestBuilders.get("/sources"))
            .andDo(MockMvcResultHandlers.print()).andExpect(MockMvcResultMatchers.status().isOk)
            .andExpect(jsonPath("$[0].id", notNullValue()))
            .andExpect(jsonPath("$[0].platform", `is`(platform)))
            .andExpect(jsonPath("$[0].valueType", `is`(valueType)))
            .andExpect(jsonPath("$[0].value", `is`(value)))
        }

        it("for call with inStructure param should return sources json structure") {
          sourceDao.insert(listOf(Source().withoutId(platform, valueType, value)))

          val result = mockMvc.perform(MockMvcRequestBuilders.get("/sources").param("inStructure", "true"))
            .andDo(MockMvcResultHandlers.print()).andExpect(MockMvcResultMatchers.status().isOk)
            .andReturn().response.contentAsString

          val accounts = Klaxon().parse<Sources>(result)?.twitter?.accounts.orEmpty()

          accounts.shouldContain("username")
        }
      }

      context("POST") {
        it("should create new source") {
          val source = Source().withoutId(platform, valueType, value)
          val request = MockMvcRequestBuilders.post("/sources").contentType(MediaType.APPLICATION_JSON_UTF8).content(source.toJsonString())
          mockMvc.perform(request)
            .andDo(MockMvcResultHandlers.print()).andExpect(MockMvcResultMatchers.status().isOk)
            .andExpect(jsonPath("$.id", notNullValue()))
            .andExpect(jsonPath("$.platform", `is`(platform)))
            .andExpect(jsonPath("$.valueType", `is`(valueType)))
            .andExpect(jsonPath("$.value", `is`(value)))

          sourceDao.findAll().size shouldBe 1
        }
        it("should return for existing source json") {

          val source = Source(8, platform, valueType, value)

          sourceDao.insert(source)

          val request = MockMvcRequestBuilders.post("/sources").contentType(MediaType.APPLICATION_JSON_UTF8).content(source.toJsonString())
          mockMvc.perform(request)
            .andDo(MockMvcResultHandlers.print()).andExpect(MockMvcResultMatchers.status().isConflict)
        }

        it("should create new source for json without id field") {
          val source = Source().withoutId(platform, valueType, value)
          val request = MockMvcRequestBuilders.post("/sources").contentType(MediaType.APPLICATION_JSON_UTF8).content("{\"platform\":\"$platform\",\"valueType\":\"$valueType\",\"value\":\"$value\"}")
          mockMvc.perform(request)
            .andDo(MockMvcResultHandlers.print()).andExpect(MockMvcResultMatchers.status().isOk)
            .andExpect(jsonPath("$.id", notNullValue()))
            .andExpect(jsonPath("$.platform", `is`(platform)))
            .andExpect(jsonPath("$.valueType", `is`(valueType)))
            .andExpect(jsonPath("$.value", `is`(value)))

          sourceDao.findAll().size shouldBe 1
        }

        it("should return bad request for not existing platform") {
          val source = Source().withoutId("platform", valueType, value)
          val request = MockMvcRequestBuilders.post("/sources").contentType(MediaType.APPLICATION_JSON_UTF8).content(source.toJsonString())
          mockMvc.perform(request)
            .andDo(MockMvcResultHandlers.print()).andExpect(MockMvcResultMatchers.status().isBadRequest)

          sourceDao.findAll().size shouldBe 0
        }

        it("should return bad request for not existing valueType for platform") {
          val source = Source().withoutId(platform, "valueType", value)
          val request = MockMvcRequestBuilders.post("/sources").contentType(MediaType.APPLICATION_JSON_UTF8).content(source.toJsonString())
          mockMvc.perform(request)
            .andDo(MockMvcResultHandlers.print()).andExpect(MockMvcResultMatchers.status().isBadRequest)

          sourceDao.findAll().size shouldBe 0
        }

      }

    }




    describe("/sources/{id}") {

      context("GET") {
        it("for  existing id should return source entry") {
          sourceDao.insert(listOf(Source(9, platform, valueType, value)))

          mockMvc.perform(MockMvcRequestBuilders.get("/sources/9"))
            .andDo(MockMvcResultHandlers.print()).andExpect(MockMvcResultMatchers.status().isOk)
        }

        it("for non existing id GET should return not found") {
          mockMvc.perform(MockMvcRequestBuilders.get("/sources/9"))
            .andDo(MockMvcResultHandlers.print()).andExpect(MockMvcResultMatchers.status().isNotFound)
        }
      }

      context("PUT") {
        it("should return conflict code if content has id different from path variable") {
          sourceDao.insert(listOf(Source(9, platform, valueType, value)))

          val source = Source(8, platform, valueType, "username2")

          val request = MockMvcRequestBuilders.put("/sources/9").contentType(MediaType.APPLICATION_JSON_UTF8).content(source.toJsonString())
          mockMvc.perform(request)
            .andDo(MockMvcResultHandlers.print()).andExpect(MockMvcResultMatchers.status().isConflict)


        }

        it("should update existing source") {
          sourceDao.insert(listOf(Source(9, platform, valueType, value)))

          val source = Source(9, platform, valueType, "username2")

          val request = MockMvcRequestBuilders.put("/sources/9").contentType(MediaType.APPLICATION_JSON_UTF8).content(source.toJsonString())
          mockMvc.perform(request)
            .andDo(MockMvcResultHandlers.print()).andExpect(MockMvcResultMatchers.status().isOk)
            .andExpect(jsonPath("$.id", notNullValue()))
            .andExpect(jsonPath("$.platform", `is`(platform)))
            .andExpect(jsonPath("$.valueType", `is`(valueType)))
            .andExpect(jsonPath("$.value", `is`("username2")))


          sourceDao.findById(9).value shouldBe "username2"


        }

        it("should return bad request for unknown platform") {
          sourceDao.insert(listOf(Source(9, platform, valueType, value)))

          val source = Source(9, "unknown", valueType, "username2")

          val request = MockMvcRequestBuilders.put("/sources/9").contentType(MediaType.APPLICATION_JSON_UTF8).content(source.toJsonString())
          mockMvc.perform(request)
            .andDo(MockMvcResultHandlers.print()).andExpect(MockMvcResultMatchers.status().isBadRequest)


          sourceDao.findById(9).platform shouldBe platform


        }

        it("should return bad request for unknown valueType for platform") {
          sourceDao.insert(listOf(Source(9, platform, valueType, value)))

          val source = Source(9, "unknown", "valueType", "username2")

          val request = MockMvcRequestBuilders.put("/sources/9").contentType(MediaType.APPLICATION_JSON_UTF8).content(source.toJsonString())
          mockMvc.perform(request)
            .andDo(MockMvcResultHandlers.print()).andExpect(MockMvcResultMatchers.status().isBadRequest)


          sourceDao.findById(9).valueType shouldBe valueType


        }

        it("should create non existing source") {

          val source = Source(9, platform, valueType, "username2")

          val request = MockMvcRequestBuilders.put("/sources/9").contentType(MediaType.APPLICATION_JSON_UTF8).content(source.toJsonString())
          mockMvc.perform(request)
            .andDo(MockMvcResultHandlers.print()).andExpect(MockMvcResultMatchers.status().isOk)
            .andExpect(jsonPath("$.id", notNullValue()))
            .andExpect(jsonPath("$.platform", `is`(platform)))
            .andExpect(jsonPath("$.valueType", `is`(valueType)))
            .andExpect(jsonPath("$.value", `is`("username2")))


          sourceDao.findAll().size shouldBe 1
          sourceDao.findById(9).value shouldBe "username2"


        }
      }

      context("DELETE") {

        it("should throw not found for not existing source") {
          mockMvc.perform(MockMvcRequestBuilders.delete("/sources/9"))
            .andDo(MockMvcResultHandlers.print()).andExpect(MockMvcResultMatchers.status().isNotFound)
        }

        it("should delete existing source") {
          sourceDao.insert(listOf(Source(9, platform, valueType, value)))

          mockMvc.perform(MockMvcRequestBuilders.delete("/sources/9"))
            .andDo(MockMvcResultHandlers.print()).andExpect(MockMvcResultMatchers.status().isOk)

          sourceDao.findAll().size shouldBe 0
        }
      }
    }


  }
}

