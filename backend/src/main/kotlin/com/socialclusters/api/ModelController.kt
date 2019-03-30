package com.socialclusters.api

import com.socialclusters.configuration.ML_BACKEND_API_URL
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RestController
import org.springframework.web.client.RestTemplate
import org.springframework.web.server.ResponseStatusException


@RestController
class ModelController(
) {

  @GetMapping("/model/train")
  fun trainModel(): Int {
    return 42
  }

  @GetMapping("/model/suggest")
  fun suggestTopicsByModel(): String {
    val uri = "$ML_BACKEND_API_URL/model/suggest"

    val restTemplate = RestTemplate()
    return restTemplate.getForObject(uri, String::class.java) ?: throw ResponseStatusException(HttpStatus.CONFLICT)

  }

  @GetMapping("/model/status")
  fun getModelStatus(): String {
    val uri = "$ML_BACKEND_API_URL/model/status"

    val restTemplate = RestTemplate()
    val result = restTemplate.getForObject(uri, String::class.java)

    return result ?: throw ResponseStatusException(HttpStatus.CONFLICT)
  }


}
