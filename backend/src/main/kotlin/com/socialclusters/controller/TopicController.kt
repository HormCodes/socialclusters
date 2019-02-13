package com.socialclusters.controller

import com.socialclusters.pojos.*
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
class TopicController {

  @RequestMapping("/topics")
  fun topics(): List<Topic> {
    return listOf()
  }
}
