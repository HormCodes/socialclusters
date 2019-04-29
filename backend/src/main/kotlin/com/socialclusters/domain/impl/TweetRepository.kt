package com.socialclusters.domain.impl

import com.socialclusters.domain.GenericPostRepository
import com.socialclusters.pojos.Tweet
import org.springframework.stereotype.Repository

@Repository
interface TweetRepository : GenericPostRepository<Tweet> {
}
