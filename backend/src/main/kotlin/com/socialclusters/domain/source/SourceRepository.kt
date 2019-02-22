package com.socialclusters.domain.source

import com.socialclusters.db.generated.user_database.tables.daos.SourceDao
import com.socialclusters.db.generated.user_database.tables.pojos.Source
import com.socialclusters.pojos.*
import org.springframework.stereotype.Repository

@Repository
class SourceRepository(
  private val sourceDao: SourceDao
) {

  fun getAllSources(): Sources {
    val sources = sourceDao.findAll()

    val twitterSources = TwitterSources(getTwitterAccounts(sources), getTwitterHashtags(sources), getTwitterWords(sources))
    val facebookSources = FacebookSources(getFacebookPages(sources), getFacebookGroups(sources))
    return Sources(twitterSources, facebookSources, MeetupSources(listOf()), RedditSources(listOf()), NewsSources(listOf()))
  }

  private fun getFacebookPages(sources: List<Source>) = getPlatformOneTypeSources(sources, FACEBOOK, PAGE)
  private fun getFacebookGroups(sources: List<Source>) = getPlatformOneTypeSources(sources, FACEBOOK, GROUP)
  private fun getTwitterHashtags(sources: List<Source>) = getPlatformOneTypeSources(sources, TWITTER, ACCOUNT)
  private fun getTwitterAccounts(sources: List<Source>) = getPlatformOneTypeSources(sources, TWITTER, HASHTAG)
  private fun getTwitterWords(sources: List<Source>) = getPlatformOneTypeSources(sources, TWITTER, WORD)

  private fun getPlatformOneTypeSources(sources: List<Source>, platform: String, type: String): List<String> {
    return sources.filter { it.platform == platform && it.valueType == type }.map { it.value }
  }

  companion object {
    private const val TWITTER = "twitter"
    private const val FACEBOOK = "facebook"
    private const val ACCOUNT = "account"
    private const val HASHTAG = "hashtag"
    private const val WORD = "word"
    private const val PAGE = "page"
    private const val GROUP = "group"
  }
}
