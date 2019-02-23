package com.socialclusters.api

import com.socialclusters.db.generated.user_database.tables.pojos.Source
import com.socialclusters.domain.source.SourceRepository
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import org.springframework.web.server.ResponseStatusException
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.PutMapping
import org.springframework.web.bind.annotation.PostMapping





@RestController
class SourceController(
  private val sourceRepository: SourceRepository
) {

  @GetMapping("/sources")
  fun getSources(@RequestParam(value = "inStructure", defaultValue = "false") inStructure: Boolean): Any {
    return when {
      inStructure -> sourceRepository.getAllSourcesStructure()
      else -> sourceRepository.findAll()
    }
  }

  @PostMapping("/sources")
  fun postSource(@RequestBody newSource: Source): Source {
    return sourceRepository.insertAndReturn(newSource)
  }

  @GetMapping("/sources/{id}")
  fun getSource(@PathVariable id: Int): Any {
    return sourceRepository.findById(id) ?: throw ResponseStatusException(HttpStatus.NOT_FOUND)
  }

  @PutMapping("/sources/{id}")
  fun putSource(@RequestBody newSource: Source, @PathVariable id: Int): Source {

    if (sourceRepository.existsById(id)) {
      sourceRepository.update(newSource)
      return sourceRepository.fetchOneById(id)
    }
    else {
      return sourceRepository.insertAndReturn(newSource)
    }
  }
}
