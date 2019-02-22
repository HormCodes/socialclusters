package io.kotlintest.provided

import io.kotlintest.AbstractProjectConfig
import io.kotlintest.extensions.ProjectLevelExtension
import io.kotlintest.spring.SpringAutowireConstructorExtension

/**
 * Project-wide configuration for KotlinTest (see https://github.com/kotlintest/kotlintest/blob/master/doc/reference.md#project-config)
 */
object ProjectConfig : AbstractProjectConfig() {
    override fun extensions(): List<ProjectLevelExtension> =
        listOf(SpringAutowireConstructorExtension)
}
