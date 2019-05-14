package com.socialclusters.api

import com.socialclusters.db.generated.user_database.Tables.USER
import com.socialclusters.db.generated.user_database.tables.daos.UserDao
import com.socialclusters.db.generated.user_database.tables.pojos.User
import com.socialclusters.utils.toJsonString
import io.kotlintest.Description
import io.kotlintest.shouldBe
import io.kotlintest.specs.DescribeSpec
import org.hamcrest.Matchers
import org.jooq.DSLContext
import org.junit.runner.RunWith
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.http.MediaType
import org.springframework.test.context.junit4.SpringRunner
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders
import org.springframework.test.web.servlet.result.MockMvcResultHandlers
import org.springframework.test.web.servlet.result.MockMvcResultMatchers

@RunWith(SpringRunner::class)
@SpringBootTest
@AutoConfigureMockMvc
class UserControllerTest(
  val mockMvc: MockMvc,
  val dslContext: DSLContext,
  val userDao: UserDao
) : DescribeSpec() {

  override fun beforeTest(description: Description) {
    dslContext.deleteFrom(USER).execute()
    signUpUser(mockMvc)
  }

  init {

    val name = "Culture"
    val textId = "culture"

    describe("/users") {
      context("GET") {

        it("for call without param should return list of user entries") {

          userDao.insert(listOf(User(null, name, textId, "a@a.com", "aaa")))

          mockMvc.perform(MockMvcRequestBuilders.get("/users").header("Authorization", "Bearer " + getAccessToken(mockMvc)))
            .andDo(MockMvcResultHandlers.print()).andExpect(MockMvcResultMatchers.status().isOk)
            .andExpect(MockMvcResultMatchers.jsonPath("$[1].id", Matchers.notNullValue()))
            .andExpect(MockMvcResultMatchers.jsonPath("$[1].username", Matchers.`is`(textId)))
            .andExpect(MockMvcResultMatchers.jsonPath("$[1].name", Matchers.`is`(name)))
        }
      }

      context("POST") {
        it("should create new user") {
          val user = User(null, name, textId, "a@a.com", "aaa")
          val request = MockMvcRequestBuilders.post("/users").contentType(MediaType.APPLICATION_JSON_UTF8).content(user.toJsonString()).header("Authorization", "Bearer " + getAccessToken(mockMvc))
          mockMvc.perform(request)
            .andDo(MockMvcResultHandlers.print()).andExpect(MockMvcResultMatchers.status().isOk)
            .andExpect(MockMvcResultMatchers.jsonPath("$.id", Matchers.notNullValue()))
            .andExpect(MockMvcResultMatchers.jsonPath("$.username", Matchers.`is`(textId)))
            .andExpect(MockMvcResultMatchers.jsonPath("$.name", Matchers.`is`(name)))

          userDao.findAll().size shouldBe 2
        }
/*        it("should return for existing user json") {

          val user = User(8, name, textId + "2", "a@a.com" + "2", "aaa")

          userDao.insert(user)

          val request = MockMvcRequestBuilders.post("/users").contentType(MediaType.APPLICATION_JSON_UTF8).content(user.toJsonString())
          mockMvc.perform(request)
            .andDo(MockMvcResultHandlers.print()).andExpect(MockMvcResultMatchers.status().isConflict)
        }*/

/*        it("should create new user for json without id field") {
          val user = User(null, name, textId, "a@a.com", "aaa")
          val request = MockMvcRequestBuilders.post("/users").contentType(MediaType.APPLICATION_JSON_UTF8).content("{\"name\":\"$name\",\"username\":\"$textId\"}")
          mockMvc.perform(request)
            .andDo(MockMvcResultHandlers.print()).andExpect(MockMvcResultMatchers.status().isOk)
            .andExpect(MockMvcResultMatchers.jsonPath("$.id", Matchers.notNullValue()))
            .andExpect(MockMvcResultMatchers.jsonPath("$.username", Matchers.`is`(textId)))
            .andExpect(MockMvcResultMatchers.jsonPath("$.name", Matchers.`is`(name)))

          userDao.findAll().size shouldBe 1
        }*/

      }

    }




    describe("/users/{id}") {

      context("GET") {
        it("for  existing id should return user entry") {
          userDao.insert(listOf(User(9, name, textId, "a@a.com", "aaa")))

          mockMvc.perform(MockMvcRequestBuilders.get("/users/9").header("Authorization", "Bearer " + getAccessToken(mockMvc)))
            .andDo(MockMvcResultHandlers.print()).andExpect(MockMvcResultMatchers.status().isOk)
        }

        it("for non existing id GET should return not found") {
          mockMvc.perform(MockMvcRequestBuilders.get("/users/9").header("Authorization", "Bearer " + getAccessToken(mockMvc)))
            .andDo(MockMvcResultHandlers.print()).andExpect(MockMvcResultMatchers.status().isNotFound)
        }
      }


      context("DELETE") {

        it("should throw not found for not existing user") {
          mockMvc.perform(MockMvcRequestBuilders.delete("/users/9").header("Authorization", "Bearer " + getAccessToken(mockMvc)))
            .andDo(MockMvcResultHandlers.print()).andExpect(MockMvcResultMatchers.status().isNotFound)
        }

        it("should delete existing user") {
          userDao.insert(listOf(User(9, name, textId, "a@a.com", "aaa")))

          mockMvc.perform(MockMvcRequestBuilders.delete("/users/9").header("Authorization", "Bearer " + getAccessToken(mockMvc)))
            .andDo(MockMvcResultHandlers.print()).andExpect(MockMvcResultMatchers.status().isOk)

          userDao.findAll().size shouldBe 1
        }
      }
    }


  }
}

