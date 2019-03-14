package com.socialclusters.domain.impl

import com.socialclusters.domain.GenericRepository
import com.socialclusters.pojos.Tweet
import org.springframework.stereotype.Repository

@Repository
interface TweetRepository : GenericRepository<Tweet> {
}
