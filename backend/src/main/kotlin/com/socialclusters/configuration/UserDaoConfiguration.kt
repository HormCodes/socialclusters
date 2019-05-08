package com.socialclusters.configuration

import com.socialclusters.db.generated.user_database.tables.daos.SourceDao
import com.socialclusters.db.generated.user_database.tables.daos.TopicDao
import com.socialclusters.db.generated.user_database.tables.daos.TrainingDao
import com.socialclusters.db.generated.user_database.tables.daos.UserDao
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration

@Configuration
class UserDaoConfiguration {

  @Bean
  fun sourceDao(configuration: org.jooq.Configuration) = SourceDao(configuration)

  @Bean
  fun topicDao(configuration: org.jooq.Configuration) = TopicDao(configuration)

  @Bean
  fun userDao(configuration: org.jooq.Configuration) = UserDao(configuration)

  @Bean
  fun trainingDao(configuration: org.jooq.Configuration) = TrainingDao(configuration)
}
