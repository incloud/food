package de.incloud.food.graphql.mutation

import com.expediagroup.graphql.generator.extensions.get
import com.expediagroup.graphql.generator.scalars.ID
import com.expediagroup.graphql.server.operations.Mutation
import de.incloud.food.graphql.error.UnauthorizedErrorException
import de.incloud.food.model.SiteRepository
import de.incloud.food.model.User
import de.incloud.food.model.UserRepository
import graphql.schema.DataFetchingEnvironment
import org.springframework.data.repository.findByIdOrNull
import org.springframework.stereotype.Component
import java.util.UUID

@Component
class UserMutation(
  private val userRepository: UserRepository,
  private val siteRepository: SiteRepository,
) : Mutation {
  suspend fun updateUserSite(
    id: ID,
    environment: DataFetchingEnvironment,
  ): User {
    val user = environment.graphQlContext.get<User>() ?: throw UnauthorizedErrorException()
    val site = siteRepository.findByIdOrNull(UUID.fromString(id.toString()))
      ?: throw Exception("Site not found")

    user.site = site
    userRepository.save(user)

    return user
  }
}
