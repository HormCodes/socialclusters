package com.socialclusters.api

import com.socialclusters.db.generated.user_database.tables.pojos.Source
import com.socialclusters.domain.SourceRepository
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.*
import org.springframework.web.server.ResponseStatusException


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
    if (sourceRepository.existsById(newSource.id)) {
      throw ResponseStatusException(HttpStatus.CONFLICT)
    }

    try {
      return sourceRepository.insertAndReturn(newSource)
    } catch (exception: Exception) {
      throw ResponseStatusException(HttpStatus.BAD_REQUEST)
    }
  }

  @GetMapping("/sources/{id}")
  fun getSource(@PathVariable id: Int): Source {
    return sourceRepository.findById(id) ?: throw ResponseStatusException(HttpStatus.NOT_FOUND)
  }

  @DeleteMapping("/sources/{id}")
  fun deleteSource(@PathVariable id: Int) {

    if (!sourceRepository.existsById(id)) {
      throw ResponseStatusException(HttpStatus.NOT_FOUND)
    }
    sourceRepository.deleteById(id)
  }

  @PutMapping("/sources/{id}")
  fun putSource(@RequestBody newSource: Source, @PathVariable id: Int): Source {

    if (newSource.id != id) {
      throw ResponseStatusException(HttpStatus.CONFLICT)
    }

    try {
      return sourceRepository.insertOrUpdateAndReturn(newSource)
    } catch (exception: Exception) {
      throw ResponseStatusException(HttpStatus.BAD_REQUEST)
    }
  }
}
