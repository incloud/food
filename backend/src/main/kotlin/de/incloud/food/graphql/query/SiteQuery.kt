package de.incloud.food.graphql.query

import com.expediagroup.graphql.server.operations.Query
import de.incloud.food.model.Site
import graphql.schema.DataFetchingEnvironment
import org.springframework.stereotype.Component

@Component
class SiteQuery(private val resolver: Resolver) : Query {
  fun sites(environment: DataFetchingEnvironment): List<Site> {
    val criteriaBuilder = resolver.em.criteriaBuilder
    val queryBuilder = criteriaBuilder.createQuery(Site::class.java)
    val root = queryBuilder.from(Site::class.java)
    queryBuilder
      .select(root)
      .orderBy(criteriaBuilder.asc(root.get<String>(Site::name.name)))
    return resolver.executeQueryBuilder(queryBuilder, 0, 1000, environment, Site::class)
  }
}
