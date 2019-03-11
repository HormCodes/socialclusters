package com.socialclusters.domain

import com.socialclusters.pojos.News
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.data.mongodb.repository.MongoRepository
import org.springframework.data.mongodb.repository.Query

interface NewsRepository : MongoRepository<News, String> {

  @Query(value = "{ 'topics' : {\$in : ?0 }}")
  fun findByTopics(topics: List<String>?, pageable: Pageable): Page<News>

  @Query(value = "{ 'topics' : {\$exists : false }}")
  fun findWithoutTopics(pageable: Pageable): Page<News>
}
