package com.socialclusters

import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get
import org.springframework.test.web.servlet.result.MockMvcResultHandlers.print
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.status

import org.junit.Test
import org.junit.runner.RunWith
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.test.context.junit4.SpringRunner
import org.springframework.test.web.servlet.MockMvc

@RunWith(SpringRunner::class)
@SpringBootTest
@AutoConfigureMockMvc
class GreetingControllerTests {

    @Autowired
    private val mockMvc: MockMvc? = null

    @Test
    @Throws(Exception::class)
    fun noParamGreetingShouldReturnDefaultMessage() {

        this.mockMvc!!.perform(get("/greeting")).andDo(print()).andExpect(status().isOk)
                .andExpect(jsonPath("$.content").value("Hello, World!"))
    }

    @Test
    @Throws(Exception::class)
    fun paramGreetingShouldReturnTailoredMessage() {

        this.mockMvc!!.perform(get("/greeting").param("name", "Spring Community"))
                .andDo(print()).andExpect(status().isOk)
                .andExpect(jsonPath("$.content").value("Hello, Spring Community!"))
    }

}
