package com.socialclusters.domain

import com.socialclusters.pojos.Tweet
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.data.mongodb.repository.MongoRepository
import org.springframework.data.mongodb.repository.Query

interface TweetRepository : MongoRepository<Tweet, String> {

  @Query(value = "{ 'topics' : {\$in : ?0 }}")
  fun findByTopics(topics: List<String>?, pageable: Pageable): Page<Tweet>

  @Query(value = "{ 'topics' : {\$exists : false }}")
  fun findWithoutTopics(pageable: Pageable): Page<Tweet>
}
