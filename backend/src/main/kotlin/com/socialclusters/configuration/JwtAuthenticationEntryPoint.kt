package com.socialclusters.configuration

import org.springframework.security.core.AuthenticationException
import org.springframework.security.web.AuthenticationEntryPoint
import org.springframework.stereotype.Component
import java.io.IOException
import javax.servlet.ServletException
import javax.servlet.http.HttpServletRequest
import javax.servlet.http.HttpServletResponse


@Component
class JwtAuthenticationEntryPoint : AuthenticationEntryPoint {
  @Throws(IOException::class, ServletException::class)
  override fun commence(httpServletRequest: HttpServletRequest,
                        httpServletResponse: HttpServletResponse,
                        e: AuthenticationException) {
    httpServletResponse.sendError(HttpServletResponse.SC_UNAUTHORIZED, e.message)
  }

}
