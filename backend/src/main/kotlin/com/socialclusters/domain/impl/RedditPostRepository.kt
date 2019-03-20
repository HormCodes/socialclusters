package com.socialclusters.domain.impl

import com.socialclusters.domain.GenericRepository
import com.socialclusters.pojos.RedditPost
import org.springframework.stereotype.Repository

@Repository
interface RedditPostRepository : GenericRepository<RedditPost>
