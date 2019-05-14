package com.socialclusters.api

import com.socialclusters.db.generated.user_database.tables.daos.UserDao
import com.socialclusters.db.generated.user_database.tables.pojos.User
import com.socialclusters.pojos.UserPrincipal
import com.socialclusters.utils.CurrentUser
import org.springframework.http.HttpStatus
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.web.bind.annotation.*
import org.springframework.web.server.ResponseStatusException

@RestController
class UserController(
  val userDao: UserDao,
  val passwordEncoder: PasswordEncoder
) {

  @GetMapping("/users")
  fun getUsers(): List<User> {
    return userDao.findAll().map { it.apply { password = "" } }
  }

  @PostMapping("/users")
  fun addUser(@RequestBody signUpRequest: User): User {
    val user = User(
      null,
      signUpRequest.name,
      signUpRequest.username,
      signUpRequest.email,
      passwordEncoder.encode(signUpRequest.password)
    )


    userDao.insert(user)

    return user.apply { password = "" }
  }

  @GetMapping("/users/{id}")
  fun getUser(@PathVariable(name = "id") id: String, @CurrentUser currentUser: UserPrincipal?): User {
    return when (id) {
      "me" -> {
        val requestUserId = currentUser?.id?.toInt() ?: throw ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR)
        userDao.findById(requestUserId).apply { password = "" }
      }
      else -> userDao.findById(id.toInt()) ?: throw ResponseStatusException(HttpStatus.NOT_FOUND)
    }
  }

  @DeleteMapping("/users/{id}")
  fun removeUser(@PathVariable(name = "id") id: Int) {
    if (!userDao.existsById(id)) {
      throw ResponseStatusException(HttpStatus.NOT_FOUND)
    }

    userDao.deleteById(id)
  }
}
