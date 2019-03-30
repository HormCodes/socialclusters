package com.socialclusters.services

import com.socialclusters.domain.impl.FacebookPostRepository
import com.socialclusters.domain.impl.NewsRepository
import com.socialclusters.domain.impl.RedditPostRepository
import com.socialclusters.domain.impl.TweetRepository
import org.springframework.stereotype.Service
import java.time.format.DateTimeFormatter

@Service
class JobService(
  private val tweetRepository: TweetRepository,
  private val newsRepository: NewsRepository,
  private val redditPostRepository: RedditPostRepository,
  private val facebookPostRepository: FacebookPostRepository
) {

  fun unifyTimestamps() {


    val posts = tweetRepository.findAll().map { post ->
      post.timestamp = StatsService.getDateObject(post.timestamp).format(DateTimeFormatter.ISO_INSTANT)
      post

    }
    tweetRepository.saveAll(posts)

    val news = newsRepository.findAll().map { post ->
      post.timestamp = StatsService.getDateObject(post.timestamp).format(DateTimeFormatter.ISO_INSTANT)
      post

    }
    newsRepository.saveAll(news)

    val redditPosts = redditPostRepository.findAll().map { post ->
      post.timestamp = StatsService.getDateObject(post.timestamp).format(DateTimeFormatter.ISO_INSTANT)
      post

    }
    redditPostRepository.saveAll(redditPosts)

    val facebookPosts = facebookPostRepository.findAll().map { post ->
      post.timestamp = StatsService.getDateObject(post.timestamp).format(DateTimeFormatter.ISO_INSTANT)
      post

    }
    facebookPostRepository.saveAll(facebookPosts)
  }


}
