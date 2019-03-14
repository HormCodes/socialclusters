package com.socialclusters.configuration

import com.mongodb.MongoClient
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.data.mongodb.config.AbstractMongoConfiguration
import org.springframework.data.mongodb.core.MongoTemplate
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories


@Configuration
//@EnableReactiveMongoRepositories
@EnableMongoRepositories(basePackages = ["com.socialclusters.domain.impl"])
class ContentDatabaseConfiguration : AbstractMongoConfiguration() {
  @Bean
  override fun mongoClient(): MongoClient {
    return MongoClient("localhost")
  }

  // ---------------------------------------------------- mongodb config

  override fun getDatabaseName(): String {
    return "content_database"
  }


  // ---------------------------------------------------- MongoTemplate

  @Bean
  @Throws(Exception::class)
  override fun mongoTemplate(): MongoTemplate {
    return MongoTemplate(mongoClient(), databaseName)
  }

}
