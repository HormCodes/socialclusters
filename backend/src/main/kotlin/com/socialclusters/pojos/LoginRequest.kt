package com.socialclusters.pojos

import javax.validation.constraints.NotBlank

class LoginRequest {
  @NotBlank
  var usernameOrEmail: String? = null

  @NotBlank
  var password: String? = null
}
