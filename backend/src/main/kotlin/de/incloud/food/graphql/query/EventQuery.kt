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
class EventQuery(private val resolver: Resolver) : Query {
  fun event(id: ID, environment: DataFetchingEnvironment): Event? = resolver.resolveSingle(id, environment, Event::class)
  fun events(site: ID, offset: Int? = null, size: Int? = null, name: String? = null, environment: DataFetchingEnvironment): List<Event> {
    val criteriaBuilder = resolver.em.criteriaBuilder

    val queryBuilder = criteriaBuilder.createQuery(Event::class.java)
    val root = queryBuilder.from(Event::class.java)

    val sitePredicate = criteriaBuilder.equal(
      root.get<Event>(Event::restaurant.name).get<Restaurant>(Restaurant::site.name).get<UUID>(Site::uuid.name),
      UUID.fromString(site.toString()),
    )

    if (name != null) {
      queryBuilder.where(
        criteriaBuilder.and(
          sitePredicate,
          criteriaBuilder.like(root.get(Event::name.name), "%$name%")
        )
      )
    } else {
      queryBuilder.where(sitePredicate)
    }

    queryBuilder
      .select(root)
      .orderBy(criteriaBuilder.desc(root.get<Long>(Event::createdAt.name)))

    return resolver.executeQueryBuilder(queryBuilder, offset, size, environment, Event::class)
  }
}
