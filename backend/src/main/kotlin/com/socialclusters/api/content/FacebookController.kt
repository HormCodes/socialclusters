package com.socialclusters.api.content

import com.socialclusters.domain.impl.FacebookPostRepository
import com.socialclusters.pojos.FacebookPost
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/contents/facebook")
class FacebookController(
  private val facebookPostRepository: FacebookPostRepository
) : GenericController<FacebookPost>(
  facebookPostRepository
)
