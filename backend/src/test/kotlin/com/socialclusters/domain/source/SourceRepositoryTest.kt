package com.socialclusters.domain.source

import com.socialclusters.db.generated.user_database.Tables
import com.socialclusters.db.generated.user_database.tables.daos.SourceDao
import com.socialclusters.db.generated.user_database.tables.pojos.Source
import com.socialclusters.pojos.*
import io.kotlintest.Description
import io.kotlintest.shouldBe
import io.kotlintest.specs.DescribeSpec
import org.jooq.DSLContext
import org.springframework.boot.test.context.SpringBootTest

@SpringBootTest // TODO - Not loading whole spring?
class SourceRepositoryTest(
  private val sourceDao: SourceDao,
  private val dslContext: DSLContext,
  private val sourceRepository: SourceRepository
) : DescribeSpec() {

  override fun beforeTest(description: Description) {
    dslContext.deleteFrom(Tables.SOURCE).execute()
  }

  init {
    describe("getSourcesStucture") {
      it("should return empty Sources object for empty table") {
        val sources = Sources(
          TwitterSources(listOf(), listOf(), listOf()),
          FacebookSources(listOf(), listOf()),
          MeetupSources(listOf()),
          RedditSources(listOf()),
          NewsSources(listOf())
        )
        sourceRepository.getAllSourcesStructure() shouldBe sources
      }


      it("should return Sources object for table with some data") {
        val account = "account"
        val hashtag = "hashtag"
        val word = "word"
        val page = "page"
        val group = "group"
        val location = "location"
        val forum = "forum"
        val rss = "rss"
        val insertedSources = listOf(
          getSource("twitter", account, account),
          getSource("twitter", hashtag, hashtag),
          getSource("twitter", word, word),
          getSource("facebook", page, page),
          getSource("facebook", group, group),
          getSource("meetup", location, location),
          getSource("reddit", forum, forum),
          getSource("news", rss, rss)
          )
        sourceDao.insert(insertedSources)

        val sources = Sources(
          TwitterSources(listOf(account), listOf(hashtag), listOf(word)),
          FacebookSources(listOf(page), listOf(group)),
          MeetupSources(listOf(location)),
          RedditSources(listOf(forum)),
          NewsSources(listOf(rss))
        )
        sourceRepository.getAllSourcesStructure() shouldBe sources
      }


    }


  }

  fun getSource(platform: String, type: String, value: String) = Source().apply {
    this.platform = platform
    this.valueType = type
    this.value = value
  }

}
