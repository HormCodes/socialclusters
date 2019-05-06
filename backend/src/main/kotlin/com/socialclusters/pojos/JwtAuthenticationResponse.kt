package com.socialclusters.pojos

data class JwtAuthenticationResponse(val accessToken: String, val tokenType: String = "Bearer")
