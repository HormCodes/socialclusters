package com.socialclusters.utils

import com.socialclusters.db.generated.user_database.tables.pojos.Source
import com.socialclusters.db.generated.user_database.tables.pojos.Topic

fun Source.withoutId(platform: String, valueType: String, value: String) = this.apply {
  this.platform = platform
  this.valueType = valueType
  this.value = value
}

fun Topic.withoutId(name: String, textId: String) = this.apply {
  this.name = name
  this.textId = textId
}

fun Source.toJsonString(): String = "{\"id\":${this.id},\"platform\":\"${this.platform}\",\"valueType\":\"${this.valueType}\",\"value\":\"${this.value}\"}"
fun Topic.toJsonString(): String = "{\"id\":${this.id},\"name\":\"${this.name}\",\"textId\":\"${this.textId}\"}"
