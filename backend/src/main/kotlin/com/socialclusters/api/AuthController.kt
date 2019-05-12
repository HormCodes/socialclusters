package com.socialclusters.api

import com.socialclusters.configuration.JwtTokenProvider
import com.socialclusters.db.generated.user_database.tables.daos.UserDao
import com.socialclusters.db.generated.user_database.tables.pojos.User
import com.socialclusters.pojos.JwtAuthenticationResponse
import com.socialclusters.pojos.LoginRequest
import org.springframework.http.HttpStatus
import org.springframework.security.authentication.AuthenticationManager
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import org.springframework.web.server.ResponseStatusException


@RestController
@RequestMapping("/auth")
class AuthController(
  val userDao: UserDao,
  val passwordEncoder: PasswordEncoder,
  val tokenProvider: JwtTokenProvider,
  val authenticationManager: AuthenticationManager
) {


  @PostMapping("/accessToken")
  fun authenticateUser(@RequestBody loginRequest: LoginRequest): JwtAuthenticationResponse {

    val authentication = authenticationManager.authenticate(
      UsernamePasswordAuthenticationToken(
        loginRequest.usernameOrEmail,
        loginRequest.password
      )
    )

    SecurityContextHolder.getContext().authentication = authentication

    val jwt = tokenProvider.generateToken(authentication)
    return JwtAuthenticationResponse(jwt)
  }

  @PostMapping("/firstUser")
  fun registerUser(@RequestBody signUpRequest: User) {
    if (userDao.findAll().size != 0) {
      throw ResponseStatusException(HttpStatus.FORBIDDEN)
    }

    // Creating user's account
    val user = User(
      null,
      signUpRequest.name,
      signUpRequest.username,
      signUpRequest.email,
      passwordEncoder.encode(signUpRequest.password)
    )


    userDao.insert(user)
  }
}
