package com.socialclusters

import com.socialclusters.configuration.UserDatabaseConfiguration
import io.kotlintest.shouldNotBe
import io.kotlintest.specs.DescribeSpec
import org.jooq.DSLContext
import org.springframework.beans.factory.annotation.Qualifier
import org.springframework.boot.test.context.SpringBootTest

@SpringBootTest(
        classes = [
            UserDatabaseConfiguration::class,
            UserDatabaseInitializer::class
        ]
)
class UserDatabaseTest(
        val dslContext: DSLContext
) : DescribeSpec({

    describe("user database") {
        it("JOOQ context should be defined") {
            dslContext shouldNotBe null
        }
    }

})
