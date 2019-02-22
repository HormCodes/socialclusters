package com.socialclusters.configuration

import com.socialclusters.db.generated.user_database.tables.daos.SourceDao
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration

@Configuration
class UserDaoConfiguration {

  @Bean
  fun sourceDao(configuration: org.jooq.Configuration) = SourceDao(configuration)
}
