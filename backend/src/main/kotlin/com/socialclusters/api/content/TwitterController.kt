package com.socialclusters.api.content

import com.socialclusters.domain.impl.TweetRepository
import com.socialclusters.pojos.Tweet
import com.socialclusters.services.JobService
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/contents/twitter")
class TwitterController(
  tweetRepository: TweetRepository,
  jobService: JobService
) : GenericController<Tweet>(tweetRepository, jobService)
