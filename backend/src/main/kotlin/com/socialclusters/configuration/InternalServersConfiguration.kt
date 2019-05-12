package com.socialclusters.configuration

import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.web.client.RestTemplate




@Configuration
class InternalServersConfiguration {

  @Bean
  fun restTemplate(): RestTemplate = RestTemplate()

  @Bean
  fun topicAnalysisServiceUrl() = "http://topic_analysis_service:5000"

  @Bean
  fun platformAPIServiceUrl() = "http://platform_api_service:6000"
}
