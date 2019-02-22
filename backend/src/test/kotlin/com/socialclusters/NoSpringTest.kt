package com.socialclusters

import io.kotlintest.shouldBe
import io.kotlintest.specs.DescribeSpec

class NoSpringTest : DescribeSpec({

    describe("Test without Spring context") {
        it("should run") {
            1 + 1 shouldBe 2
        }
        it("should run 2") {
            1 + 1 shouldBe 2
        }
    }

})
