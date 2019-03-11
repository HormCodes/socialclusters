package com.socialclusters.domain

import com.socialclusters.domain.MongoQueries.Companion.containingTopics
import com.socialclusters.domain.MongoQueries.Companion.withoutTopics
import com.socialclusters.pojos.Tweet
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.data.mongodb.repository.MongoRepository
import org.springframework.data.mongodb.repository.Query

interface TweetRepository : MongoRepository<Tweet, String> {

  @Query(value = containingTopics)
  fun findByTopics(topics: List<String>?, pageable: Pageable): Page<Tweet>

  @Query(value = withoutTopics)
  fun findWithoutTopics(pageable: Pageable): Page<Tweet>
}
