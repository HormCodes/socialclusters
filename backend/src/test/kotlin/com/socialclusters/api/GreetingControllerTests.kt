package com.socialclusters.api

import io.kotlintest.specs.DescribeSpec
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get
import org.springframework.test.web.servlet.result.MockMvcResultHandlers.print
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.status

import org.junit.runner.RunWith
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.test.context.junit4.SpringRunner
import org.springframework.test.web.servlet.MockMvc

@RunWith(SpringRunner::class)
@SpringBootTest
@AutoConfigureMockMvc
class GreetingControllerTests(
  val mockMvc: MockMvc
) : DescribeSpec({

  describe("greeting endpoint") {

    it("should return Hello World without param") {
      mockMvc.perform(get("/greeting"))
        .andDo(print()).andExpect(status().isOk)
        .andExpect(jsonPath("$.content").value("Hello, World!"))
    }

    it("should retorn Hello Param with param") {
      mockMvc.perform(get("/greeting")
        .param("name", "Spring Community"))
        .andDo(print()).andExpect(status().isOk)
        .andExpect(jsonPath("$.content").value("Hello, Spring Community!"))
    }
  }


})
