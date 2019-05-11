package com.socialclusters.api

import com.socialclusters.db.generated.user_database.Tables
import com.socialclusters.db.generated.user_database.tables.daos.TrainingDao
import com.socialclusters.db.generated.user_database.tables.pojos.Training
import org.jooq.DSLContext
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.*
import org.springframework.web.client.RestTemplate
import org.springframework.web.server.ResponseStatusException

@RestController
@RequestMapping("/analysis/topic")
class TopicAnalysisController(
  val trainingDao: TrainingDao,
  val dslContext: DSLContext,
  val topicAnalysisServiceUrl: String,
  val restTemplate: RestTemplate
) {

  @GetMapping("/accuracy")
  fun getAccuracy(): Double {
    val lastTraining = dslContext.selectFrom(Tables.TRAINING).where(listOf(
      Tables.TRAINING.IS_DONE.eq(true),
      Tables.TRAINING.MODEL_ID.eq("topic_analysis")
    )).orderBy(Tables.TRAINING.ID.desc()).limit(1).fetchOne()

    return lastTraining.accuracy.toDouble()
  }

  @PostMapping("/trainings")
  fun trainModel(): Training {
    val id = restTemplate.getForObject("$topicAnalysisServiceUrl/train", String::class.java)
      ?: throw ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR)

    return trainingDao.fetchOneById(id.toInt())
  }

  @GetMapping("/trainings")
  fun getTrainings(): List<Training> = trainingDao.fetchByModelId("topic_analysis")

  @GetMapping("/suggestion")
  fun getSuggestion() {

    val message = restTemplate.getForObject("$topicAnalysisServiceUrl/train", String::class.java)

    if (message != "Done") {
      throw ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  @PostMapping("/trainings/{id}")
  fun getTraining(@PathVariable(name = "id") id: Int) = trainingDao.fetchOneById(id)
    ?: throw ResponseStatusException(HttpStatus.NOT_FOUND)
}
