package com.socialclusters.configuration

import org.springframework.boot.test.context.TestConfiguration
import org.springframework.context.annotation.Bean
import org.springframework.web.client.RestTemplate


@TestConfiguration
class InternalServersConfiguration {


  @Bean
  fun restTemplate(): RestTemplate = RestTemplate()

  @Bean
  fun mlBackendUrl() = "http://localhost:5000"
}
