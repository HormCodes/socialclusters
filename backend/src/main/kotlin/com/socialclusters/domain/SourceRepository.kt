package com.socialclusters.domain

import com.socialclusters.configuration.UserDatabaseConfiguration
import com.socialclusters.db.generated.user_database.Tables.SOURCE
import com.socialclusters.db.generated.user_database.tables.daos.SourceDao
import com.socialclusters.db.generated.user_database.tables.pojos.Source
import com.socialclusters.pojos.*
import org.jooq.impl.DSL.using
import org.springframework.stereotype.Repository

@Repository
class SourceRepository(
  configuration: UserDatabaseConfiguration
) : SourceDao(configuration.jooqConfiguration()){

  fun getAllSourcesStructure(): Sources {
    val sources = findAll()

    val twitterSources = TwitterSources(getTwitterAccounts(sources), getTwitterHashtags(sources), getTwitterWords(sources))
    val facebookSources = FacebookSources(getFacebookPages(sources), getFacebookGroups(sources))
    val reddit = RedditSources(getRedditForums(sources))
    val news = NewsSources(getRssFeeds(sources))
    val meetupSources = MeetupSources(getMeetupLocations(sources))
    return Sources(twitterSources, facebookSources, meetupSources, reddit, news)
  }

  fun insertAndReturn(source: Source): Source {
    val record = using(configuration()).newRecord(SOURCE, source)
    record.insert()
    return Source(record.id, record.platform, record.valueType, record.value)
  }

  private fun getMeetupLocations(sources: List<Source>) = getPlatformOneTypeSources(sources, MEETUP, LOCATION)
  private fun getRssFeeds(sources: List<Source>) = getPlatformOneTypeSources(sources, NEWS, RSS)
  private fun getRedditForums(sources: List<Source>) = getPlatformOneTypeSources(sources, REDDIT, FORUM)
  private fun getFacebookPages(sources: List<Source>) = getPlatformOneTypeSources(sources, FACEBOOK, PAGE)
  private fun getFacebookGroups(sources: List<Source>) = getPlatformOneTypeSources(sources, FACEBOOK, GROUP)
  private fun getTwitterHashtags(sources: List<Source>) = getPlatformOneTypeSources(sources, TWITTER, HASHTAG)
  private fun getTwitterAccounts(sources: List<Source>) = getPlatformOneTypeSources(sources, TWITTER, ACCOUNT)
  private fun getTwitterWords(sources: List<Source>) = getPlatformOneTypeSources(sources, TWITTER, WORD)

  private fun getPlatformOneTypeSources(sources: List<Source>, platform: String, type: String): List<String> {
    return sources.filter { it.platform == platform && it.valueType == type }.map { it.value }
  }

  companion object {
    private const val TWITTER = "twitter"
    private const val FACEBOOK = "facebook"
    private const val MEETUP = "meetup"
    private const val REDDIT = "reddit"
    private const val NEWS = "news"
    private const val ACCOUNT = "account"
    private const val HASHTAG = "hashtag"
    private const val WORD = "word"
    private const val PAGE = "page"
    private const val GROUP = "group"
    private const val FORUM = "forum"
    private const val RSS = "rss"
    private const val LOCATION = "location"
  }
}
