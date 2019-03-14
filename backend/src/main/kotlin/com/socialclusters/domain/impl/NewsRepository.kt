package com.socialclusters.domain.impl

import com.socialclusters.domain.GenericRepository
import com.socialclusters.pojos.News
import org.springframework.stereotype.Repository

@Repository
interface NewsRepository : GenericRepository<News>
