package com.socialclusters.configuration

import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration


@Configuration
class InternalServersConfiguration {

  @Bean
  fun mlBackendUrl() = "ml_backned:5000"
}
