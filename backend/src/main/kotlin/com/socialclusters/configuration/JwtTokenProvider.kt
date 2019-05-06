package com.socialclusters.configuration

import com.socialclusters.pojos.UserPrincipal
import io.jsonwebtoken.Jwts
import io.jsonwebtoken.MalformedJwtException
import io.jsonwebtoken.SignatureAlgorithm
import io.jsonwebtoken.UnsupportedJwtException
import org.springframework.beans.factory.annotation.Value
import org.springframework.security.core.Authentication
import org.springframework.stereotype.Component
import java.security.SignatureException
import java.util.*


@Component
class JwtTokenProvider {

  @Value("\${spring.application.jwtSecret}")
  private val jwtSecret: String? = null

  @Value("\${spring.application.jwtExpirationInMs}")
  private val jwtExpirationInMs: Int = 0

  fun generateToken(authentication: Authentication): String {

    val userPrincipal = authentication.principal as UserPrincipal

    val now = Date()
    val expiryDate = Date(now.getTime() + jwtExpirationInMs)

    return Jwts.builder()
      .setSubject(userPrincipal.id.toString())
      .setIssuedAt(Date())
      .setExpiration(expiryDate)
      .signWith(SignatureAlgorithm.HS512, jwtSecret)
      .compact()
  }

  fun getUserIdFromJWT(token: String): Long? {
    val claims = Jwts.parser()
      .setSigningKey(jwtSecret)
      .parseClaimsJws(token)
      .getBody()

    return java.lang.Long.parseLong(claims.getSubject())
  }

  fun validateToken(authToken: String): Boolean {
    try {
      Jwts.parser().setSigningKey(jwtSecret).parseClaimsJws(authToken)
      return true
    } catch (ex: SignatureException) {
      println("Invalid JWT signature")
    } catch (ex: MalformedJwtException) {
      println("Invalid JWT token")
    } catch (ex: UnsupportedJwtException) {
      println("Unsupported JWT token")
    } catch (ex: IllegalArgumentException) {
      println("JWT claims string is empty.")
    }

    return false
  }
}
