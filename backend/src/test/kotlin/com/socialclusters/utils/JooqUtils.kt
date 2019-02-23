package com.socialclusters.utils

import com.socialclusters.db.generated.user_database.tables.pojos.Source
import sun.rmi.rmic.iiop.ValueType

fun Source.withoutId(platform: String, valueType: String, value: String) = this.apply {
  this.platform = platform
  this.valueType = valueType
  this.value = value
}
