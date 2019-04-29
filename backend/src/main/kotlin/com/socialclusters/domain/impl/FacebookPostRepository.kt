package com.socialclusters.domain.impl

import com.socialclusters.domain.GenericPostRepository
import com.socialclusters.pojos.FacebookPost
import org.springframework.stereotype.Repository

@Repository
interface FacebookPostRepository : GenericPostRepository<FacebookPost>
