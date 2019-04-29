package com.socialclusters.api.content

import com.socialclusters.domain.GenericRepository
import com.socialclusters.pojos.Post
import com.socialclusters.services.JobService
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.*
import org.springframework.web.server.ResponseStatusException

abstract class GenericController<E>(
  private val repository: GenericRepository<E>,
  private val jobService: JobService
) {

  @GetMapping
  fun getContent(
    @RequestParam(value = "withoutTopic", defaultValue = "false") withoutTopic: Boolean,
    @RequestParam(value = "topics", defaultValue = "") topics:
    String, pageable: Pageable
  ): Page<E> {
    // TODO - Without topic and topics exception

    println(pageable)

    if (withoutTopic) {
      return repository.findWithoutTopics(pageable)
    }

    val topicList = topics.split(",")

    if (topics.isNotEmpty()) {
      return repository.findByTopics(topicList, pageable)
    }

    return repository.findAll(pageable)
  }

  @GetMapping("/{id}")
  fun getPost(@PathVariable id: String): E {
    return repository.findById(id).orElse(null) ?: throw ResponseStatusException(HttpStatus.NOT_FOUND)
  }

  @DeleteMapping("/{id}")
  fun deletePost(@PathVariable id: String) {
    if (!repository.existsById(id)) {
      throw ResponseStatusException(HttpStatus.NOT_FOUND)
    }

    repository.deleteById(id)
  }

  @PatchMapping("/{id}/topics")
  fun setTopics(@PathVariable id: String, @RequestBody newTopics: List<String>): E {
    val post: E = repository.findById(id).orElse(null) ?: throw ResponseStatusException(HttpStatus.NOT_FOUND)

    (post as Post).topics = newTopics
    (post as Post).suggestedTopics = listOf()

    repository.save(post)

    return post
  }
}
