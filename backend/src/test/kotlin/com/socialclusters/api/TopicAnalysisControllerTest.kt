package com.socialclusters.api

import com.socialclusters.db.generated.user_database.Tables
import com.socialclusters.db.generated.user_database.tables.daos.TrainingDao
import com.socialclusters.db.generated.user_database.tables.pojos.Training
import io.kotlintest.Description
import io.kotlintest.specs.DescribeSpec
import org.hamcrest.Matchers
import org.jooq.DSLContext
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.http.MediaType
import org.springframework.test.web.client.MockRestServiceServer
import org.springframework.test.web.client.match.MockRestRequestMatchers
import org.springframework.test.web.client.response.MockRestResponseCreators
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders
import org.springframework.test.web.servlet.result.MockMvcResultHandlers
import org.springframework.test.web.servlet.result.MockMvcResultMatchers
import org.springframework.web.client.RestTemplate
import java.sql.Timestamp
import java.time.OffsetDateTime

@AutoConfigureMockMvc
@SpringBootTest
class TopicAnalysisControllerTest(
  val mockMvc: MockMvc,
  val trainingDao: TrainingDao,
  val dslContext: DSLContext,
  val restTemplate: RestTemplate,
  val topicAnalysisServiceUrl: String
) : DescribeSpec() {
  override fun beforeTest(description: Description) {
    dslContext.deleteFrom(Tables.TRAINING).execute()
  }

  init {

    describe("/analysis/topic/trainings") {
      context("POST") {
        it("should start new training") {
          trainingDao.insert(Training(1, TOPIC_MODEL_NAME, false, Timestamp.from(OffsetDateTime.now().toInstant()), null, null))


          val mockServer = MockRestServiceServer.createServer(restTemplate)
          mockServer
            .expect(MockRestRequestMatchers.requestTo("$topicAnalysisServiceUrl/train"))
            .andRespond(MockRestResponseCreators.withSuccess("1", MediaType.TEXT_HTML))


          val request = MockMvcRequestBuilders.post("/analysis/topic/trainings")
          mockMvc.perform(request)
            .andDo(MockMvcResultHandlers.print()).andExpect(MockMvcResultMatchers.status().isOk)
            .andExpect(MockMvcResultMatchers.jsonPath("$.modelId", Matchers.`is`("topic_analysis")))
            .andExpect(MockMvcResultMatchers.jsonPath("$.isDone", Matchers.`is`(false)))
            .andExpect(MockMvcResultMatchers.jsonPath("$.id", Matchers.`is`(1)))
        }
      }
    }

    describe("/analysis/topic/accuracy") {
      it("should return accuracy percentage for last trained model and non trained model should be ignored") {
        trainingDao.insert(Training(1, TOPIC_MODEL_NAME, true, Timestamp.from(OffsetDateTime.now().toInstant()), Timestamp.from(OffsetDateTime.now().toInstant()), 32.1.toBigDecimal()))
        trainingDao.insert(Training(2, TOPIC_MODEL_NAME, true, Timestamp.from(OffsetDateTime.now().toInstant()), Timestamp.from(OffsetDateTime.now().toInstant()), 42.1.toBigDecimal()))
        trainingDao.insert(Training(3, TOPIC_MODEL_NAME, false, Timestamp.from(OffsetDateTime.now().toInstant()), null, null))

        val request = MockMvcRequestBuilders.get("/analysis/topic/accuracy")
        mockMvc.perform(request)
          .andDo(MockMvcResultHandlers.print()).andExpect(MockMvcResultMatchers.status().isOk)
          .andExpect(MockMvcResultMatchers.jsonPath("$", Matchers.`is`(42.1)))

      }
    }
  }

  companion object {
    const val TOPIC_MODEL_NAME = "topic_analysis"
  }
}
