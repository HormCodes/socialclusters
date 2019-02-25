package com.socialclusters.api

import com.socialclusters.domain.TwitterRepository
import com.socialclusters.pojos.Tweet
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.*
import org.springframework.web.server.ResponseStatusException

@RestController
class ContentController(
  private val twitterRepository: TwitterRepository
) {

  @GetMapping("/contents/twitter")
  fun getTwitterContent(@RequestParam(value = "withoutTopic", defaultValue = "false") withoutTopic: Boolean, @RequestParam(value = "topics", defaultValue = "") topics: String): List<Tweet> {
    // TODO - Without topic and topics exception

    if (withoutTopic) {
      return twitterRepository.findWithoutTopics()
    }

    val topicList = topics.split(",")

    if (topics.isNotEmpty()) {
      return twitterRepository.findByTopics(topicList)
    }

    return twitterRepository.findAll()
  }

  @GetMapping("/contents/twitter/{id}")
  fun getTweet(@PathVariable id: String): Tweet {
    return twitterRepository.findById(id).orElse(null) ?: throw ResponseStatusException(HttpStatus.NOT_FOUND)
  }

  @DeleteMapping("/contents/twitter/{id}")
  fun deleteTweet(@PathVariable id: String) {
    if (!twitterRepository.existsById(id)) {
      throw ResponseStatusException(HttpStatus.NOT_FOUND)
    }

    twitterRepository.deleteById(id)
  }

  @PatchMapping("/contents/twitter/{id}/topics")
  fun setTopics(@PathVariable id: String, @RequestBody newTopics: List<String>): Tweet {
    val tweet = twitterRepository.findById(id).orElse(null) ?: throw ResponseStatusException(HttpStatus.NOT_FOUND)

    tweet.topics = newTopics

    twitterRepository.save(tweet)

    return tweet
  }
}
