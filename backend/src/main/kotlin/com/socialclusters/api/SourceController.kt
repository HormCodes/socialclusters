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
    if (sourceRepository.existsById(newSource.id)) {
      throw ResponseStatusException(HttpStatus.CONFLICT)
    }

    return sourceRepository.insertAndReturn(newSource)
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

    return when {
      sourceRepository.existsById(id) -> {
        sourceRepository.update(newSource)
        sourceRepository.fetchOneById(id)
      }
      else -> sourceRepository.insertAndReturn(newSource)
    }
  }
}
