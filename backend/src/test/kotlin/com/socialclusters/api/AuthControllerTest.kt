package com.socialclusters.api

import com.socialclusters.db.generated.user_database.Tables
import com.socialclusters.db.generated.user_database.tables.daos.UserDao
import com.socialclusters.db.generated.user_database.tables.pojos.User
import com.socialclusters.utils.toJsonString
import io.kotlintest.Description
import io.kotlintest.specs.DescribeSpec
import org.jooq.DSLContext
import org.junit.runner.RunWith
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.http.MediaType
import org.springframework.test.context.junit4.SpringRunner
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.ResultActions
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders
import org.springframework.test.web.servlet.result.MockMvcResultHandlers
import org.springframework.test.web.servlet.result.MockMvcResultMatchers

@RunWith(SpringRunner::class)
@SpringBootTest
@AutoConfigureMockMvc
class AuthControllerTest(
  val mockMvc: MockMvc,
  val userDao: UserDao,
  val dslContext: DSLContext
) : DescribeSpec() {
  override fun beforeTest(description: Description) {
    dslContext.deleteFrom(Tables.USER).execute()
  }

  init {
    describe("/auth/firstUser") {
      it("should work only for first user") {
        signUpUser(mockMvc).andDo(MockMvcResultHandlers.print()).andExpect(MockMvcResultMatchers.status().isOk)
        signUpUser(mockMvc).andDo(MockMvcResultHandlers.print()).andExpect(MockMvcResultMatchers.status().isForbidden)
      }
    }

    describe("/auth/accessToken") {
      signUpUser(mockMvc)
      getAccessToken(mockMvc)

      val request = MockMvcRequestBuilders.get("/topics").header("Authorization", "Bearer " + getAccessToken(mockMvc))
      mockMvc.perform(request).andDo(MockMvcResultHandlers.print()).andExpect(MockMvcResultMatchers.status().isOk)
    }

  }

}

fun getNewUser(): User {
  return User(null, "Admin", "admin", "admin@admin.com", "admin")
}

fun signUpUser(mockMvc: MockMvc): ResultActions {
  val request = MockMvcRequestBuilders.post("/auth/firstUser").content(getNewUser().toJsonString()).contentType(MediaType.APPLICATION_JSON_UTF8)
  return mockMvc.perform(request)
}

fun getAccessToken(mockMvc: MockMvc): String {
  val request = MockMvcRequestBuilders.post("/auth/accessToken").content("{\"usernameOrEmail\": \"admin\", \"password\": \"admin\"}").contentType(MediaType.APPLICATION_JSON_UTF8)
  val contentAsString = mockMvc.perform(request).andDo(MockMvcResultHandlers.print()).andReturn().response.contentAsString
  return contentAsString.substring(contentAsString.indexOf("\"accessToken\":\"") + "\"accessToken\":\"".length, contentAsString.indexOf("\",\"tokenType\":\"Bearer\""))
}

