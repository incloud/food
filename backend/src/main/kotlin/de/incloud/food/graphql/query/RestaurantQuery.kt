package de.incloud.food.graphql.query

import com.expediagroup.graphql.generator.scalars.ID
import com.expediagroup.graphql.server.operations.Query
import de.incloud.food.model.Event
import de.incloud.food.model.Restaurant
import de.incloud.food.model.Site
import graphql.schema.DataFetchingEnvironment
import org.springframework.stereotype.Component
import java.util.UUID

@Component
class RestaurantQuery(private val resolver: Resolver) : Query {
  fun restaurant(id: ID, environment: DataFetchingEnvironment): Restaurant? =
    resolver.resolveSingle(id, environment, Restaurant::class)

  fun restaurants(site: ID, name: String? = null, environment: DataFetchingEnvironment): List<Restaurant> {
    val criteriaBuilder = resolver.em.criteriaBuilder

    val queryBuilder = criteriaBuilder.createQuery(Restaurant::class.java)
    val root = queryBuilder.from(Restaurant::class.java)
    queryBuilder.select(root)

    val predicates = mutableListOf(
      criteriaBuilder.equal(
        root.get<Site>(Restaurant::site.name).get<UUID>(Site::uuid.name),
        UUID.fromString(site.toString()),
      ),
      criteriaBuilder.equal(
        root.get<Boolean>(Restaurant::deleted.name),
        false
      )
    )

    if (name != null) {
      predicates.add(criteriaBuilder.like(root.get(Restaurant::name.name), "%$name%"))
    }

    queryBuilder
      .where(criteriaBuilder.and(*predicates.toTypedArray()))
      .orderBy(criteriaBuilder.asc(root.get<String>(Event::name.name)))

    return resolver.executeQueryBuilder(queryBuilder, 0, 1000, environment, Restaurant::class)
  }
}
