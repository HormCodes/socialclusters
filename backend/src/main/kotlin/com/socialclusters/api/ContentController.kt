package com.socialclusters.api

import com.socialclusters.domain.TweetRepository
import com.socialclusters.pojos.Tweet
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.*
import org.springframework.web.server.ResponseStatusException

@RestController
class ContentController(
  private val tweetRepository: TweetRepository
) {

  @GetMapping("/contents/twitter")
  fun getTwitterContent(
    @RequestParam(value = "withoutTopic", defaultValue = "false") withoutTopic: Boolean,
    @RequestParam(value = "topics", defaultValue = "") topics:
    String, pageable: Pageable
  ): Page<Tweet> {
    // TODO - Without topic and topics exception

    if (withoutTopic) {
      return tweetRepository.findWithoutTopics(pageable)
    }

    val topicList = topics.split(",")

    if (topics.isNotEmpty()) {
      return tweetRepository.findByTopics(topicList, pageable)
    }

    return tweetRepository.findAll(pageable)
  }

  @GetMapping("/contents/twitter/{id}")
  fun getTweet(@PathVariable id: String): Tweet {
    return tweetRepository.findById(id).orElse(null) ?: throw ResponseStatusException(HttpStatus.NOT_FOUND)
  }

  @DeleteMapping("/contents/twitter/{id}")
  fun deleteTweet(@PathVariable id: String) {
    if (!tweetRepository.existsById(id)) {
      throw ResponseStatusException(HttpStatus.NOT_FOUND)
    }

    tweetRepository.deleteById(id)
  }

  @PatchMapping("/contents/twitter/{id}/topics")
  fun setTopics(@PathVariable id: String, @RequestBody newTopics: List<String>): Tweet {
    val tweet = tweetRepository.findById(id).orElse(null) ?: throw ResponseStatusException(HttpStatus.NOT_FOUND)

    tweet.topics = newTopics

    tweetRepository.save(tweet)

    return tweet
  }
}
