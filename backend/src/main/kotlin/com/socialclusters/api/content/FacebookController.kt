package com.socialclusters.api.content

import com.socialclusters.domain.impl.FacebookPostRepository
import com.socialclusters.pojos.FacebookPost
import com.socialclusters.services.JobService
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/contents/facebook")
class FacebookController(
  facebookPostRepository: FacebookPostRepository,
  jobService: JobService
) : GenericController<FacebookPost>(
  facebookPostRepository, jobService
)
