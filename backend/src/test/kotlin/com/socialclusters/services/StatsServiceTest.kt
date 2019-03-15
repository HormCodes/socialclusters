package com.socialclusters.services

import com.socialclusters.services.StatsService.Companion.getDateObject
import io.kotlintest.shouldBe
import io.kotlintest.specs.DescribeSpec

class StatsServiceTest : DescribeSpec({

  describe("getDateObject") {

    it("should return same date object from timestamp string of both types") {
      val firstTimestamp = "Wed Mar 7 07:20:00 +0000 2019"
      val secondTimestamp = "Wed, 07 Mar 2019 07:20:00 GMT"
      val thirdTimestamp = "Wed, 07 Mar 2019 08:20:00 +0100"

      val firstDate = getDateObject(firstTimestamp)
      val secondDate = getDateObject(secondTimestamp)
      val thirdDate = getDateObject(thirdTimestamp)

      firstDate shouldBe secondDate
      firstDate shouldBe thirdDate
      secondDate shouldBe thirdDate
    }
  }

})


