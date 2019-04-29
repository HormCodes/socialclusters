package com.socialclusters.api.content

import com.socialclusters.domain.impl.NewsRepository
import com.socialclusters.pojos.News
import com.socialclusters.services.JobService
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/contents/news")
class NewsController(
  newsRepository: NewsRepository,
  jobService: JobService
) : GenericPostController<News>(newsRepository, jobService)
