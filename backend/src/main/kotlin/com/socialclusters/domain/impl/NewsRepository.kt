package com.socialclusters.domain.impl

import com.socialclusters.domain.GenericPostRepository
import com.socialclusters.pojos.News
import org.springframework.stereotype.Repository

@Repository
interface NewsRepository : GenericPostRepository<News>
