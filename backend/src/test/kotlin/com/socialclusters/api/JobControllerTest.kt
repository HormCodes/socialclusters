package com.socialclusters.api

import io.kotlintest.specs.DescribeSpec
import org.junit.runner.RunWith
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.http.MediaType
import org.springframework.http.client.ClientHttpRequest
import org.springframework.test.context.junit4.SpringRunner
import org.springframework.test.util.AssertionErrors.assertTrue
import org.springframework.test.web.client.ExpectedCount
import org.springframework.test.web.client.MockRestServiceServer
import org.springframework.test.web.client.RequestMatcher
import org.springframework.test.web.client.response.MockRestResponseCreators
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders
import org.springframework.test.web.servlet.result.MockMvcResultHandlers
import org.springframework.test.web.servlet.result.MockMvcResultMatchers
import org.springframework.web.client.RestTemplate
import java.io.IOException


@RunWith(SpringRunner::class)
@SpringBootTest
@AutoConfigureMockMvc
class JobControllerTest(
  val restTemplate: RestTemplate,
  val mockMvc: MockMvc,
  val platformAPIServiceUrl: String
) : DescribeSpec({
  describe("/jobs/contentDownloads") {
    it("should execute download request") {
      val mockServer = MockRestServiceServer.createServer(restTemplate)
      mockServer
        .expect(ExpectedCount.manyTimes(), requestContainsUri(platformAPIServiceUrl))
        .andRespond(MockRestResponseCreators.withSuccess("Done", MediaType.TEXT_HTML))

      val request = MockMvcRequestBuilders.post("/jobs/contentDownloads")
        .header("Authorization", "Bearer " + getAccessToken(mockMvc))

      mockMvc
        .perform(request)
        .andDo(MockMvcResultHandlers.print())
        .andExpect(MockMvcResultMatchers.status().isOk)
    }
  }
})

fun requestContainsUri(uri: String): RequestMatcher {
  return RequestContainsUriMatcher(uri)
}


class RequestContainsUriMatcher(private val uri: String) : RequestMatcher {

  @Throws(IOException::class, AssertionError::class)
  override fun match(clientHttpRequest: ClientHttpRequest) {
    assertTrue("aaa", clientHttpRequest.uri.toASCIIString().contains(uri))
  }
}
