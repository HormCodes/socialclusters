package com.socialclusters.domain

import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.data.mongodb.repository.MongoRepository
import org.springframework.data.mongodb.repository.Query

interface GenericRepository<E> : MongoRepository<E, String> {

  @Query(value = MongoQueries.withoutTopics)
  fun findWithoutTopics(pageable: Pageable): Page<E>

  @Query(value = MongoQueries.containingTopics)
  fun findByTopics(topicList: List<String>, pageable: Pageable): Page<E>
}
