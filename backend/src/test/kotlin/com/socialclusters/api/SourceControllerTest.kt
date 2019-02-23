package com.socialclusters.api

import com.beust.klaxon.JsonArray
import com.beust.klaxon.JsonObject
import com.beust.klaxon.Klaxon
import com.beust.klaxon.Parser
import com.socialclusters.db.generated.user_database.Tables
import com.socialclusters.db.generated.user_database.tables.daos.SourceDao
import com.socialclusters.db.generated.user_database.tables.pojos.Source
import com.socialclusters.pojos.Sources
import com.socialclusters.utils.withoutId
import io.kotlintest.Description
import io.kotlintest.matchers.collections.contain
import io.kotlintest.matchers.collections.shouldContain
import io.kotlintest.matchers.string.contain
import io.kotlintest.should
import io.kotlintest.specs.DescribeSpec
import org.hamcrest.Matchers.`is`
import org.hamcrest.Matchers.notNullValue
import org.jooq.DSLContext
import org.junit.runner.RunWith
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.core.io.InputStreamSource
import org.springframework.test.context.junit4.SpringRunner
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders
import org.springframework.test.web.servlet.result.MockMvcResultHandlers
import org.springframework.test.web.servlet.result.MockMvcResultMatchers
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath
import java.io.InputStream
import javax.xml.crypto.Data

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

    describe("/sources") {

      it("for call without param should return list of source entries") {
        val platform = "twitter"
        val valueType = "account"
        val value = "username"
        sourceDao.insert(listOf(Source().withoutId(platform, valueType, value)))

        mockMvc.perform(MockMvcRequestBuilders.get("/sources"))
          .andDo(MockMvcResultHandlers.print()).andExpect(MockMvcResultMatchers.status().isOk)
          .andExpect(jsonPath("$[0].id", notNullValue()))
          .andExpect(jsonPath("$[0].platform", `is`(platform)))
          .andExpect(jsonPath("$[0].valueType", `is`(valueType)))
          .andExpect(jsonPath("$[0].value", `is`(value)))
      }

      it("for call with inStructure param should return sources json structure") {
        val platform = "twitter"
        val valueType = "account"
        val value = "username"
        sourceDao.insert(listOf(Source().withoutId(platform, valueType, value)))

        val result = mockMvc.perform(MockMvcRequestBuilders.get("/sources").param("inStructure", "true"))
          .andDo(MockMvcResultHandlers.print()).andExpect(MockMvcResultMatchers.status().isOk)
          .andReturn().response.contentAsString

        val accounts = Klaxon().parse<Sources>(result)?.twitter?.accounts.orEmpty()

        accounts.shouldContain("username")
      }
    }




    describe("/sources/{id}") {

      it("for existing id GET should return source entry") {
        val platform = "twitter"
        val valueType = "account"
        val value = "username"
        sourceDao.insert(listOf(Source(9, platform, valueType, value)))

        mockMvc.perform(MockMvcRequestBuilders.get("/sources/9"))
          .andDo(MockMvcResultHandlers.print()).andExpect(MockMvcResultMatchers.status().isOk)
      }

      it("for non existing id GET should return ") {
        mockMvc.perform(MockMvcRequestBuilders.get("/sources/9"))
          .andDo(MockMvcResultHandlers.print()).andExpect(MockMvcResultMatchers.status().isNotFound)
      }
    }


  }
}

