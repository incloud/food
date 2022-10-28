package de.incloud.food.graphql.query

import com.expediagroup.graphql.generator.extensions.get
import com.expediagroup.graphql.generator.scalars.ID
import com.expediagroup.graphql.server.operations.Query
import de.incloud.food.graphql.error.UnauthorizedErrorException
import de.incloud.food.model.User
import de.incloud.food.model.UserRepository
import graphql.schema.DataFetchingEnvironment
import org.springframework.stereotype.Component

@Component
class UserQuery(
  private val resolver: Resolver,
  private val repository: UserRepository
) : Query {
  fun currentUser(environment: DataFetchingEnvironment): User = environment.graphQlContext.get<User>() ?: throw UnauthorizedErrorException()

  fun user(id: ID? = null, email: String? = null, environment: DataFetchingEnvironment): User? {
    if (email != null) {
      return repository.findDistinctByEmail(email)
    }

    if (id != null) {
      return resolver.resolveSingle(id, environment, User::class)
    }

    throw Exception("You need to specify either email or id!")
  }

  fun users(offset: Int?, size: Int?, environment: DataFetchingEnvironment): List<User> = resolver.resolveCollection(offset, size, environment, User::class)
}
