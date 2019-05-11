package com.socialclusters.api

import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController
import org.springframework.web.client.RestTemplate

@RestController
class JobController(
  val restTemplate: RestTemplate,
  val platformAPIServiceUrl: String
) {



  // TODO - POST?
  @RequestMapping("/jobs/data")
  fun scrapeData(@RequestParam(value = "facebookAccessToken", defaultValue = "") facebookAccessToken: String) {
    val uri = "$platformAPIServiceUrl/"

    restTemplate.getForObject(uri + "twitter", String::class.java)
    restTemplate.getForObject(uri + "news", String::class.java)
    restTemplate.getForObject(uri + "reddit", String::class.java)

    if (facebookAccessToken != "") {
      restTemplate.getForObject(uri + "facebook?token=$facebookAccessToken", String::class.java)
    }
  }


}
