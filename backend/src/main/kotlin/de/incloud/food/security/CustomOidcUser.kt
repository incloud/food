package de.incloud.food.security

import de.incloud.food.model.User
import org.springframework.security.core.authority.SimpleGrantedAuthority
import org.springframework.security.oauth2.core.oidc.OidcIdToken
import org.springframework.security.oauth2.core.oidc.OidcUserInfo
import org.springframework.security.oauth2.core.oidc.user.DefaultOidcUser

class CustomOidcUser(
  val user: User,
  idToken: OidcIdToken,
  userInfo: OidcUserInfo,
) : DefaultOidcUser(
  listOf(SimpleGrantedAuthority("ROLE_USER")),
  idToken,
  userInfo
)
