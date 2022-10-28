package de.incloud.food.graphql.mutation

import com.expediagroup.graphql.generator.extensions.get
import com.expediagroup.graphql.generator.scalars.ID
import com.expediagroup.graphql.server.operations.Mutation
import de.incloud.food.graphql.error.UnauthorizedErrorException
import de.incloud.food.graphql.query.Resolver
import de.incloud.food.model.Event
import de.incloud.food.model.Restaurant
import de.incloud.food.model.RestaurantRepository
import de.incloud.food.model.SiteRepository
import de.incloud.food.model.User
import graphql.schema.DataFetchingEnvironment
import org.springframework.data.repository.findByIdOrNull
import org.springframework.stereotype.Component
import java.time.Instant
import java.util.UUID

class CreateRestaurantMutationInput(
  var name: String,
  var siteId: ID,
  var address: String? = null,
  var phone: String? = null,
  var website: String? = null,
  var delivery: Boolean = true,
  var comment: String? = null,
)
class UpdateRestaurantMutationInput(
  var id: ID,
  var name: String,
  var address: String? = null,
  var phone: String? = null,
  var website: String? = null,
  var delivery: Boolean = true,
  var comment: String? = null,
)

@Component
class RestaurantMutation(
  private val resolver: Resolver,
  private val restaurantRepository: RestaurantRepository,
  private val siteRepository: SiteRepository,
) : Mutation {
  fun createRestaurant(input: CreateRestaurantMutationInput, environment: DataFetchingEnvironment): Restaurant {
    val user = environment.graphQlContext.get<User>() ?: throw UnauthorizedErrorException()
    val site = siteRepository.findByIdOrNull(UUID.fromString(input.siteId.toString()))
      ?: throw Exception("Site not found")

    val restaurant = Restaurant(
      name = input.name,
      address = input.address,
      phone = input.phone,
      website = input.website,
      delivery = input.delivery,
      comment = input.comment,
      site = site,
      createdBy = user,
    )

    restaurantRepository.save(restaurant)

    return restaurant
  }

  fun updateRestaurant(input: UpdateRestaurantMutationInput, environment: DataFetchingEnvironment): Restaurant {
    val user = environment.graphQlContext.get<User>() ?: throw UnauthorizedErrorException()
    val restaurant = restaurantRepository.findByIdOrNull(UUID.fromString(input.id.toString()))
      ?: throw Exception("Restaurant not found")

    restaurant.name = input.name
    restaurant.address = input.address
    restaurant.phone = input.phone
    restaurant.website = input.website
    restaurant.delivery = input.delivery
    restaurant.comment = input.comment

    restaurant.updatedAt = Instant.now().epochSecond
    restaurant.updatedBy = user

    restaurantRepository.save(restaurant)

    return restaurant
  }

  fun deleteRestaurant(id: ID, environment: DataFetchingEnvironment): String {
    val user = environment.graphQlContext.get<User>() ?: throw UnauthorizedErrorException()
    val restaurant = restaurantRepository.findByIdOrNull(UUID.fromString(id.toString()))
      ?: throw Exception("Restaurant not found")

    val criteriaBuilder = resolver.em.criteriaBuilder
    val queryBuilder = criteriaBuilder.createQuery(Long::class.java)
    val root = queryBuilder.from(Event::class.java)
    queryBuilder.where(
      criteriaBuilder.equal(root.get<Restaurant>(Event::restaurant.name), restaurant)
    )
    queryBuilder.select(criteriaBuilder.count(root))
    val numberOfEvents = resolver.em.createQuery(queryBuilder).singleResult

    // We do not want to delete restaurants with events in order to keep the event history intact
    if (numberOfEvents > 0) {
      restaurant.deleted = true
      restaurant.updatedAt = Instant.now().epochSecond
      restaurant.updatedBy = user
      restaurantRepository.save(restaurant)

      return "Marked restaurant as deleted"
    }

    restaurantRepository.delete(restaurant)

    return "Deleted restaurant"
  }
}
