package com.socialclusters.domain

import com.socialclusters.domain.MongoQueries.Companion.containingTopics
import com.socialclusters.domain.MongoQueries.Companion.withoutTopics
import com.socialclusters.pojos.News
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.data.mongodb.repository.MongoRepository
import org.springframework.data.mongodb.repository.Query

interface NewsRepository : MongoRepository<News, String> {

  @Query(value = containingTopics)
  fun findByTopics(topics: List<String>?, pageable: Pageable): Page<News>

  @Query(value = withoutTopics)
  fun findWithoutTopics(pageable: Pageable): Page<News>
}
