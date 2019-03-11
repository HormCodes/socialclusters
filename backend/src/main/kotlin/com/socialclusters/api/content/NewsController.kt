package com.socialclusters.api.content

import com.socialclusters.domain.NewsRepository
import com.socialclusters.pojos.News
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.*
import org.springframework.web.server.ResponseStatusException

@RestController
class NewsController(
  private val newsRepository: NewsRepository
) {

  // TODO - Tests

  @GetMapping("/contents/news")
  fun getNewsContent(
    @RequestParam(value = "withoutTopic", defaultValue = "false") withoutTopic: Boolean,
    @RequestParam(value = "topics", defaultValue = "") topics:
    String, pageable: Pageable
  ): Page<News> {
    // TODO - Without topic and topics exception

    if (withoutTopic) {
      return newsRepository.findWithoutTopics(pageable)
    }

    val topicList = topics.split(",")

    if (topics.isNotEmpty()) {
      return newsRepository.findByTopics(topicList, pageable)
    }

    return newsRepository.findAll(pageable)
  }


  @GetMapping("/contents/news/{id}")
  fun getNews(@PathVariable id: String): News {
    return newsRepository.findById(id).orElse(null) ?: throw ResponseStatusException(HttpStatus.NOT_FOUND)
  }

  @DeleteMapping("/contents/news/{id}")
  fun deleteNews(@PathVariable id: String) {
    if (!newsRepository.existsById(id)) {
      throw ResponseStatusException(HttpStatus.NOT_FOUND)
    }

    newsRepository.deleteById(id)
  }

  @PatchMapping("/contents/news/{id}/topics")
  fun setTopics(@PathVariable id: String, @RequestBody newTopics: List<String>): News {
    val news = newsRepository.findById(id).orElse(null) ?: throw ResponseStatusException(HttpStatus.NOT_FOUND)

    news.topics = newTopics

    newsRepository.save(news)

    return news
  }
}
