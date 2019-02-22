package com.socialclusters.api

import com.socialclusters.pojos.Twitter
import com.socialclusters.repository.TwitterRepository
import org.bson.types.ObjectId
import org.springframework.web.bind.annotation.*
import java.util.*

@RestController
class PostController(
  private val twitterRepository: TwitterRepository
) {

  @RequestMapping(value = ["/posts/twitter/"], method = [RequestMethod.GET])
  fun getTwitterPosts(@RequestParam(value = "withoutTopic", defaultValue = "false") withoutTopic: Boolean): List<Twitter> {
    val posts = twitterRepository.findAll().toList()
    return when {
      withoutTopic -> {
        posts
      }
      else -> posts.filter { it.topics == null }
    }
  }

  @RequestMapping(value = ["/posts/twitter/{id}"], method = [RequestMethod.GET])
  fun getTwitterPostById(@PathVariable("id") id: ObjectId): Optional<Twitter> {
    return twitterRepository.findById(id.toString())
  }
}
