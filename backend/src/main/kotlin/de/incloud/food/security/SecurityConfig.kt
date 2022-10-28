package de.incloud.food.security

import de.incloud.food.model.User
import de.incloud.food.model.UserRepository
import org.springframework.context.annotation.Bean
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity
import org.springframework.security.config.web.server.ServerHttpSecurity
import org.springframework.security.oauth2.client.oidc.userinfo.OidcReactiveOAuth2UserService
import org.springframework.security.oauth2.client.oidc.userinfo.OidcUserRequest
import org.springframework.security.oauth2.client.userinfo.ReactiveOAuth2UserService
import org.springframework.security.oauth2.core.oidc.user.OidcUser
import org.springframework.security.web.server.SecurityWebFilterChain

@EnableWebFluxSecurity
class SecurityConfig(
  private val userRepository: UserRepository
) {
  @Bean
  fun springSecurityFilterChain(http: ServerHttpSecurity): SecurityWebFilterChain = http
    .csrf().disable()
    .authorizeExchange()
    .pathMatchers("/sdl").permitAll()
    .anyExchange().authenticated()
    .and()
    .oauth2Login() // .authenticationSuccessHandler(authenticationSuccessHandler)
    .and()
    .build()

  @Bean
  fun oidcUserService(): ReactiveOAuth2UserService<OidcUserRequest?, OidcUser>? {
    val delegate = OidcReactiveOAuth2UserService()
    return ReactiveOAuth2UserService { userRequest: OidcUserRequest? ->
      delegate.loadUser(userRequest).map { oidcUser: OidcUser ->
        var user = userRepository.findDistinctByEmail(oidcUser.email)
        if (user == null) {
          user = User(oidcUser.givenName ?: "", oidcUser.familyName ?: "", oidcUser.email)
        }

        user.firstName = oidcUser.givenName ?: oidcUser.fullName ?: ""
        user.lastName = oidcUser.familyName ?: ""
        user.email = oidcUser.email

        userRepository.save(user)

        CustomOidcUser(user, oidcUser.idToken, oidcUser.userInfo)
      }
    }
  }
}
