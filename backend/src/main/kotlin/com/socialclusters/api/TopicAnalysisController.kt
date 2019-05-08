package com.socialclusters.api

import com.socialclusters.db.generated.user_database.Tables
import com.socialclusters.db.generated.user_database.tables.daos.TrainingDao
import org.jooq.DSLContext
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/analysis/topic")
class TopicAnalysisController(
  val trainingDao: TrainingDao,
  val dslContext: DSLContext
) {

  @GetMapping("/accuracy")
  fun getAccuracy(): Double {
    val lastTraining = dslContext.selectFrom(Tables.TRAINING).where(listOf(
      Tables.TRAINING.IS_DONE.eq(true),
      Tables.TRAINING.MODEL_ID.eq("topic_analysis")
    )).orderBy(Tables.TRAINING.ID.desc()).limit(1).fetchOne()

    return lastTraining.accuracy.toDouble()
  }
}
