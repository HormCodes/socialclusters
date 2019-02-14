package com.socialclusters.repository

import com.socialclusters.pojos.Twitter
import org.springframework.data.mongodb.repository.MongoRepository

interface TwitterRepository : MongoRepository<Twitter, String> {
}
