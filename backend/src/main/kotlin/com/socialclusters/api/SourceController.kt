package com.socialclusters.api

import com.socialclusters.db.generated.user_database.tables.pojos.Source
import com.socialclusters.domain.source.SourceRepository
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import org.springframework.web.server.ResponseStatusException

@RestController
class SourceController(
  private val sourceRepository: SourceRepository
) {

  @RequestMapping("/sources")
  fun getSources(@RequestParam(value = "inStructure", defaultValue = "false") inStructure: Boolean): Any {
    return when {
      inStructure -> sourceRepository.getAllSourcesStructure()
      else -> sourceRepository.findAll()
    }
  }

  @GetMapping("/sources/{id}")
  fun getSource(@PathVariable id: Int): Any {
    return sourceRepository.findById(id) ?: throw ResponseStatusException(HttpStatus.NOT_FOUND)
  }
}
