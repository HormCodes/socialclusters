package com.socialclusters.configuration

import com.socialclusters.db.generated.user_database.tables.daos.*
import org.jooq.DSLContext
import org.jooq.SQLDialect
import org.jooq.impl.DSL
import org.jooq.impl.DefaultConfiguration
import org.springframework.beans.factory.annotation.Qualifier
import org.springframework.boot.context.properties.ConfigurationProperties
import org.springframework.boot.context.properties.EnableConfigurationProperties
import org.springframework.boot.jdbc.DataSourceBuilder
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.context.annotation.Primary
import javax.sql.DataSource

@Configuration
@EnableConfigurationProperties
class UserDatabaseConfiguration {

  @Bean
  @Primary
  @Qualifier("userDatabase")
  @ConfigurationProperties(prefix = "spring.datasource")
  fun dataSource(): DataSource = DataSourceBuilder.create().build()

  @Bean
  fun dslContext(): DSLContext = DSL.using(jooqConfiguration())

  @Bean
  fun jooqConfiguration(): org.jooq.Configuration = DefaultConfiguration().apply {
    setDataSource(dataSource())
    setSQLDialect(SQLDialect.POSTGRES)
  }

}
