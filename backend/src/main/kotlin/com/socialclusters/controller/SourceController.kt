package com.socialclusters.controller

import com.socialclusters.pojos.*
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
class SourceController {

  @RequestMapping("/sources")
  fun sources(): Sources {

    val twitter = TwitterSources(listOf(), listOf(), listOf())
    val facebook = FacebookSources(listOf(), listOf())
    val meetup = MeetupSources(listOf())
    val reddit = RedditSources(listOf())
    val news = NewsSources(listOf())

    return Sources(twitter, facebook, meetup, reddit, news)
  }
}
