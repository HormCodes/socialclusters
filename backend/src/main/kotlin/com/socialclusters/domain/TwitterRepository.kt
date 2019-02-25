package com.socialclusters.domain

import com.socialclusters.pojos.Tweet
import org.springframework.data.mongodb.repository.MongoRepository
import org.springframework.data.mongodb.repository.Query

interface TwitterRepository : MongoRepository<Tweet, String> {

  @Query(value = "{ 'topics' : {\$in : ?0 }}")
  fun findByTopics(topics: List<String>?): List<Tweet>

  @Query(value = "{ 'topics' : {\$exists : false }}")
  fun findWithoutTopics(): List<Tweet>
}
