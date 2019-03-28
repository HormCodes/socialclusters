package com.socialclusters.api

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
  fun suggestTopicsByModel(): Int {
    return 42
  }

  @GetMapping("/model/status")
  fun getModelStatus(): String {
    val uri = "http://localhost:5000/model/status"

    val restTemplate = RestTemplate()
    val result = restTemplate.getForObject(uri, String::class.java)

    return result ?: throw ResponseStatusException(HttpStatus.CONFLICT)
  }


}
