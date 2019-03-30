package com.socialclusters.api

import com.socialclusters.configuration.ML_BACKEND_API_URL
import com.socialclusters.services.JobService
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController
import org.springframework.web.client.RestTemplate

@RestController
class JobController(
  val jobService: JobService
) {

  // TODO - POST?
  @RequestMapping("/job/timestamps")
  fun unifyTimestamps(): String {
    jobService.unifyTimestamps()
    return "Done"
  }

  // TODO - POST?
  @RequestMapping("/job/data")
  fun scrapeData(@RequestParam(value = "facebookAccessToken", defaultValue = "") facebookAccessToken: String) {
    val uri = "$ML_BACKEND_API_URL/data/"

    val restTemplate = RestTemplate()
    restTemplate.getForObject(uri + "twitter", String::class.java)
    restTemplate.getForObject(uri + "rss", String::class.java)
    restTemplate.getForObject(uri + "reddit", String::class.java)

    if (facebookAccessToken != "") {
      restTemplate.getForObject(uri + "facebook?token=$facebookAccessToken", String::class.java)
    }
  }

  // TODO - POST?
  @PostMapping("/job/model/train")
  fun trainModel() {

  }

}
