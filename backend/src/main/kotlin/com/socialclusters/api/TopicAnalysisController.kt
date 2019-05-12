package com.socialclusters.api

import com.socialclusters.db.generated.user_database.Tables
import com.socialclusters.db.generated.user_database.tables.daos.TrainingDao
import com.socialclusters.db.generated.user_database.tables.pojos.Training
import com.socialclusters.db.generated.user_database.tables.records.TrainingRecord
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

    val message = restTemplate.getForObject("$topicAnalysisServiceUrl/suggest", String::class.java)

    if (message != "Done") {
      throw ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  @GetMapping("/trainings/{id}")
  fun getTraining(@PathVariable(name = "id") id: String): Training {

    return when (id) {
      "last" -> trainingDao.fetchOneById((getLastTraining() ?: throw ResponseStatusException(HttpStatus.NOT_FOUND)).id)
      "running" -> {

        val lastTraining = getLastTraining() ?: throw ResponseStatusException(HttpStatus.NOT_FOUND)
        val lastInTraining = dslContext.selectFrom(Tables.TRAINING).where(listOf(
          Tables.TRAINING.IS_DONE.eq(false),
          Tables.TRAINING.MODEL_ID.eq("topic_analysis")
        )).orderBy(Tables.TRAINING.ID.desc()).limit(1).fetchOne() ?: throw ResponseStatusException(HttpStatus.NOT_FOUND)

        if (lastTraining.id > lastInTraining.id) {
          throw ResponseStatusException(HttpStatus.NOT_FOUND)
        }
        trainingDao.fetchOneById(lastInTraining.id)
      }
      else -> trainingDao.fetchOneById(id.toInt()) ?: throw ResponseStatusException(HttpStatus.NOT_FOUND)
    }

  }

  private fun getLastTraining(): TrainingRecord? {
    return dslContext.selectFrom(Tables.TRAINING).where(listOf(
      Tables.TRAINING.IS_DONE.eq(true),
      Tables.TRAINING.MODEL_ID.eq("topic_analysis")
    )).orderBy(Tables.TRAINING.ID.desc()).limit(1).fetchOne()
  }
}
