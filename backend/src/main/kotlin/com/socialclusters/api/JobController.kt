package com.socialclusters.api

import com.socialclusters.domain.impl.NewsRepository
import com.socialclusters.domain.impl.TweetRepository
import com.socialclusters.services.StatsService.Companion.getDateObject
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RestController
import java.time.format.DateTimeFormatter

@RestController
class JobController(
  val tweetRepository: TweetRepository,
  val newsRepository: NewsRepository
) {

  // TODO - POST?
  @PostMapping("/job/timestamps")
  fun unifyTimestamps() {

    val tweetPosts = tweetRepository.findAll().map { post ->
      post.timestamp = getDateObject(post.timestamp).format(DateTimeFormatter.ISO_INSTANT)
      post

    }
    tweetRepository.saveAll(tweetPosts)


    val newsPosts = newsRepository.findAll().map { post ->
      post.timestamp = getDateObject(post.timestamp).format(DateTimeFormatter.ISO_INSTANT)
      post

    }
    newsRepository.saveAll(newsPosts)
  }

  // TODO - POST?
  @PostMapping("/job/model/train")
  fun trainModel() {

  }

}
