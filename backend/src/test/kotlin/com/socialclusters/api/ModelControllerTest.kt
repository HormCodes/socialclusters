package com.socialclusters.api

import io.kotlintest.specs.DescribeSpec
import org.hamcrest.Matchers
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders
import org.springframework.test.web.servlet.result.MockMvcResultHandlers
import org.springframework.test.web.servlet.result.MockMvcResultMatchers

@SpringBootTest
@AutoConfigureMockMvc
class ModelControllerTest(
  val mockMvc: MockMvc
) : DescribeSpec({
  describe("model/status") {
    it("should return valid json of model status") {
      mockMvc.perform(MockMvcRequestBuilders.get("/model/status"))
        .andDo(MockMvcResultHandlers.print()).andExpect(MockMvcResultMatchers.status().isOk)
        .andExpect(MockMvcResultMatchers.jsonPath("$.isTrained", Matchers.`is`(true)))
    }
  }
})
