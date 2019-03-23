package com.socialclusters.api

import com.socialclusters.services.StatsService
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController

@RestController
class StatsController(
  val statsService: StatsService
) {
  @GetMapping("/stats/day/topic")
  fun getWeekData(
    @RequestParam(value = "from", defaultValue = "") from: String,
    @RequestParam(value = "to", defaultValue = "") to: String
  ) = statsService.getDayCounts(from, to)
}
