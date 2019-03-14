package com.socialclusters.domain.impl

import com.socialclusters.configuration.UserDatabaseConfiguration
import com.socialclusters.db.generated.user_database.Tables.TOPIC
import com.socialclusters.db.generated.user_database.tables.daos.TopicDao
import com.socialclusters.db.generated.user_database.tables.pojos.Topic
import org.jooq.impl.DSL
import org.springframework.stereotype.Repository

@Repository
class TopicRepository(
  configuration: UserDatabaseConfiguration
) : TopicDao(configuration.jooqConfiguration()) {


  fun insertAndReturn(topic: Topic): Topic {
    val record = DSL.using(configuration()).newRecord(TOPIC, topic)
    record.insert()
    return Topic(record.id, record.name, record.textId)
  }


}
