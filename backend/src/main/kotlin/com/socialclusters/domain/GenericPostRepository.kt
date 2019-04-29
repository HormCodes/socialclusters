package com.socialclusters.domain

import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.data.mongodb.repository.MongoRepository
import org.springframework.data.mongodb.repository.Query

interface GenericPostRepository<E> : MongoRepository<E, String> {

  @Query(value = MongoQueries.withoutTopics)
  fun findWithoutTopics(pageable: Pageable): Page<E>

  @Query(value = MongoQueries.containingTopics)
  fun findByTopics(topicList: List<String>, pageable: Pageable): Page<E>

  @Query(value = MongoQueries.withSuggestedTopics)
  fun findWithSuggestedTopics(pageable: Pageable): Page<E>

  //fun findByQuery(query: org.springframework.data.mongodb.core.query.Query, pageable: Pageable)

}
