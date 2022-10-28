package de.incloud.food.graphql.context

import com.expediagroup.graphql.server.spring.execution.DefaultSpringGraphQLContextFactory
import de.incloud.food.model.User
import de.incloud.food.security.CustomOidcUser
import kotlinx.coroutines.reactive.awaitFirstOrNull
import kotlinx.coroutines.reactor.ReactorContext
import org.springframework.security.core.context.SecurityContext
import org.springframework.stereotype.Component
import org.springframework.web.reactive.function.server.ServerRequest
import reactor.core.publisher.Mono
import kotlin.coroutines.coroutineContext

@Component
class CustomContextFactory : DefaultSpringGraphQLContextFactory() {
  // See: https://opensource.expediagroup.com/graphql-kotlin/docs/server/spring-server/spring-graphql-context
  override suspend fun generateContextMap(request: ServerRequest): Map<*, Any> {
    val reactorContext = coroutineContext[ReactorContext]?.context ?: throw RuntimeException("Reactor Context unavailable")

    /*
     * We are building a completely private API here, so exceptions are thrown when there is no user
     * this would need to be adjusted when you want authentication to be optional
     */
    val securityContext = reactorContext.getOrDefault<Mono<SecurityContext>>(
      SecurityContext::class.java,
      null
    )?.awaitFirstOrNull() ?: throw RuntimeException("Security Context unavailable")

    val principal = securityContext.authentication.principal

    if (principal !is CustomOidcUser) {
      throw RuntimeException("GraphQL should not be reachable without user!")
    }

    return super.generateContextMap(request) + mapOf(
      User::class to principal.user,
      ServerRequest::class to request,
    )
  }
}
