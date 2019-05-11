package com.socialclusters.utils

import java.time.OffsetDateTime
import java.time.format.DateTimeFormatter

fun OffsetDateTime.toISOString() = this.format(DateTimeFormatter.ISO_INSTANT)
