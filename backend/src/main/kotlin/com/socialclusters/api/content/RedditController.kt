package com.socialclusters.api.content

import com.socialclusters.domain.impl.RedditPostRepository
import com.socialclusters.pojos.RedditPost
import com.socialclusters.services.JobService
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/contents/reddit")
class RedditController(
  redditPostRepository: RedditPostRepository,
  jobService: JobService
) : GenericController<RedditPost>(
  redditPostRepository, jobService
)
