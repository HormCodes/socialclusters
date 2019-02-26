package com.socialclusters.configuration

import io.kotlintest.specs.DescribeSpec
import org.junit.Test
import org.junit.runner.RunWith
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.http.MediaType
import org.springframework.test.context.junit4.SpringRunner
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.options
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.status

@RunWith(SpringRunner::class)
@SpringBootTest
@AutoConfigureMockMvc
class SecutityConfigurationTest(
  val mvc: MockMvc
) : DescribeSpec() {

  init {
    describe("all requests") {
      it("should not throw CORS error for getting topics") {

        mvc.perform(options("/topics")
          .header("Origin", "http://localhost:3000")
          .header("Access-Control-Request-Method", "GET"))
          .andExpect(status().isOk)
      }
      it("should not throw CORS error for editing topic") {

        mvc.perform(options("/topics/10")
          .header("Origin", "http://localhost:3000")
          .header("Access-Control-Request-Method", "PUT").contentType(MediaType.APPLICATION_JSON_UTF8).content("{}")
        )
          .andExpect(status().isOk)
      }
    }
  }

  @Test
  fun optionsRequestShouldNotThrowError() {
  }
}
