package com.socialclusters.api

import com.socialclusters.pojos.DayNumbers
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RestController

@RestController
class StatsController(
) {

  @GetMapping("/stats/week")
  fun getWeekData(): List<DayNumbers> {

    val response = """
         [
          {
          date: "19.9.2018":
            totalPosts: 15
            inCategory: [
              {category: "culture"
count: 15
              }
            ]
         }
         ]


    """.trimIndent()

    return listOf()


  }

}
