package com.socialclusters.domain.impl

import com.socialclusters.domain.GenericPostRepository
import com.socialclusters.pojos.RedditPost
import org.springframework.stereotype.Repository

@Repository
interface RedditPostRepository : GenericPostRepository<RedditPost>
