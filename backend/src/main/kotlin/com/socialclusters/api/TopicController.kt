package com.socialclusters.api

import com.socialclusters.db.generated.user_database.tables.pojos.Topic
import com.socialclusters.domain.source.TopicRepository
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.*
import org.springframework.web.server.ResponseStatusException

// TODO - Almost same as SourceController
@RestController
class TopicController(
  private val topicRepository: TopicRepository
) {

  @GetMapping("/topics")
  fun topics(): List<Topic> {
    return topicRepository.findAll()
  }

  @PostMapping("/topics")
  fun postSource(@RequestBody newTopic: Topic): Topic {
    if (topicRepository.existsById(newTopic.id)) {
      throw ResponseStatusException(HttpStatus.CONFLICT)
    }

    return topicRepository.insertAndReturn(newTopic)
  }

  @GetMapping("/topics/{id}")
  fun getSource(@PathVariable id: Int): Topic {
    return topicRepository.findById(id) ?: throw ResponseStatusException(HttpStatus.NOT_FOUND)
  }

  @DeleteMapping("/topics/{id}")
  fun deleteTopic(@PathVariable id: Int) {

    if (!topicRepository.existsById(id)) {
      throw ResponseStatusException(HttpStatus.NOT_FOUND)
    }
    topicRepository.deleteById(id)
  }

  @PutMapping("/topics/{id}")
  fun putTopic(@RequestBody newTopic: Topic, @PathVariable id: Int): Topic {

    if (newTopic.id != id) {
      throw ResponseStatusException(HttpStatus.CONFLICT)
    }

    return when {
      topicRepository.existsById(id) -> {
        topicRepository.update(newTopic)
        topicRepository.fetchOneById(id)
      }
      else -> topicRepository.insertAndReturn(newTopic)
    }
  }
}
