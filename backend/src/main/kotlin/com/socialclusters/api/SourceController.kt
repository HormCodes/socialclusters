package com.socialclusters.api

import com.socialclusters.db.generated.user_database.tables.pojos.Source
import com.socialclusters.domain.source.SourceRepository
import com.socialclusters.pojos.*
import org.springframework.data.repository.query.Param
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController

@RestController
class SourceController(
  private val sourceRepository: SourceRepository
) {

  @RequestMapping("/sources")
  fun sources(@RequestParam(value = "inStructure", defaultValue = "false") inStructure: Boolean): List<Source> {
    return sourceRepository.findAll()
  }
}
