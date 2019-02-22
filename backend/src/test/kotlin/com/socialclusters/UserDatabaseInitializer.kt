package com.socialclusters

import org.flywaydb.core.Flyway
import org.springframework.beans.factory.annotation.Qualifier
import org.springframework.boot.CommandLineRunner
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import javax.sql.DataSource


@Configuration
class UserDatabaseInitializer {

    @Bean
    fun migrateUserDatabase(dataSource: DataSource) = CommandLineRunner {
        println("called")
        val flyway = Flyway()
        flyway.dataSource = dataSource
        flyway.setLocations("db/migration")
        flyway.migrate()

    }

}
