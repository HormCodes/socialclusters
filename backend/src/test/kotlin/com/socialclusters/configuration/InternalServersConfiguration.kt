package com.socialclusters.configuration

import org.springframework.boot.test.context.TestConfiguration
import org.springframework.context.annotation.Bean


@TestConfiguration
class InternalServersConfiguration {

  @Bean
  fun mlBackendUrl() = "localhost:5000"
}
