package com.socialclusters.services

import com.socialclusters.db.generated.user_database.tables.daos.UserDao
import com.socialclusters.pojos.UserPrincipal
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.security.core.userdetails.UserDetailsService
import org.springframework.security.core.userdetails.UsernameNotFoundException
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class CustomUserDetailsService(
  val userDao: UserDao
) : UserDetailsService {

  @Transactional
  @Throws(UsernameNotFoundException::class)
  override fun loadUserByUsername(usernameOrEmail: String): UserDetails {
    // Let people login with either username or email

    val ownUser = userDao.fetchOneByUsername(usernameOrEmail) ?: userDao.fetchOneByEmail(usernameOrEmail)
    ?: throw IllegalArgumentException()
    return UserPrincipal.create(ownUser)


  }

  // This method is used by JWTAuthenticationFilter
  @Transactional
  fun loadUserById(id: Long): UserDetails {

    val ownUser = userDao.findById(id.toInt()) ?: throw IllegalArgumentException()
    return UserPrincipal.create(ownUser)
  }
}
