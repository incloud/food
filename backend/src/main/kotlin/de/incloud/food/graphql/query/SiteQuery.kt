package de.incloud.food.graphql.query

import com.expediagroup.graphql.generator.scalars.ID
import com.expediagroup.graphql.server.operations.Query
import de.incloud.food.model.Site
import graphql.schema.DataFetchingEnvironment
import org.springframework.stereotype.Component

@Component
class SiteQuery(private val resolver: Resolver) : Query {
  fun site(id: ID, environment: DataFetchingEnvironment): Site? = resolver.resolveSingle(id, environment, Site::class)

  fun sites(name: String? = null, environment: DataFetchingEnvironment): List<Site> {
    val criteriaBuilder = resolver.em.criteriaBuilder
    val queryBuilder = criteriaBuilder.createQuery(Site::class.java)
    val root = queryBuilder.from(Site::class.java)

    if (name != null) {
      queryBuilder.where(criteriaBuilder.like(root.get(Site::name.name), "%$name%"))
    }

    queryBuilder
      .select(root)
      .orderBy(criteriaBuilder.asc(root.get<String>(Site::name.name)))
    return resolver.executeQueryBuilder(queryBuilder, 0, 1000, environment, Site::class)
  }
}
