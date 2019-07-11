package com.socialclusters.utils

import com.socialclusters.api.getAccessToken
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders

fun getPostRequest(url: String, accessToken: String) = MockMvcRequestBuilders.post(url).header("Authorization", "Bearer $accessToken")
fun getGetRequest(url: String, accessToken: String) = MockMvcRequestBuilders.get(url).header("Authorization", "Bearer $accessToken")
