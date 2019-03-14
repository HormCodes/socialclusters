package com.socialclusters.domain

import com.socialclusters.db.generated.user_database.Tables
import com.socialclusters.db.generated.user_database.tables.daos.SourceDao
import com.socialclusters.db.generated.user_database.tables.pojos.Source
import com.socialclusters.domain.impl.SourceRepository
import com.socialclusters.pojos.*
import com.socialclusters.utils.withoutId
import io.kotlintest.Description
import io.kotlintest.shouldBe
import io.kotlintest.shouldNotBe
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
          Source().withoutId("twitter", account, account),
          Source().withoutId("twitter", hashtag, hashtag),
          Source().withoutId("twitter", word, word),
          Source().withoutId("facebook", page, page),
          Source().withoutId("facebook", group, group),
          Source().withoutId("meetup", location, location),
          Source().withoutId("reddit", forum, forum),
          Source().withoutId("news", rss, rss)
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

    describe("insertAndReturn") {
      it("should insert new source and return it back") {
        val insertedSource = Source().withoutId("twitter", "account", "username")
        val returnedSource = sourceRepository.insertAndReturn(insertedSource)

        sourceDao.findAll().size shouldBe 1
        sourceDao.fetchById(returnedSource.id) shouldNotBe null
        returnedSource.platform shouldBe insertedSource.platform
        returnedSource.valueType shouldBe insertedSource.valueType
        returnedSource.value shouldBe insertedSource.value
      }
    }


  }


}
