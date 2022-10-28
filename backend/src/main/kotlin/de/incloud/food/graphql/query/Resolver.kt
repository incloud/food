package de.incloud.food.graphql.query

import com.expediagroup.graphql.generator.scalars.ID
import graphql.schema.DataFetchingEnvironment
import graphql.schema.DataFetchingFieldSelectionSet
import org.apache.logging.log4j.kotlin.Logging
import org.hibernate.graph.GraphSemantic
import org.springframework.stereotype.Component
import java.util.UUID
import javax.persistence.EntityGraph
import javax.persistence.EntityManager
import javax.persistence.Subgraph
import javax.persistence.criteria.CriteriaQuery
import kotlin.reflect.KClass

@Component
class Resolver(
  val em: EntityManager
) {
  companion object : Logging

  fun <T : Any> resolveSingle(id: ID, environment: DataFetchingEnvironment, clazz: KClass<T>): T? {
    return em.find(
      clazz.java,
      UUID.fromString(id.toString()),
      createGraphFindProperties(environment, clazz)
    )
  }

  fun <T : Any> resolveCollection(
    page: Int?,
    size: Int?,
    environment: DataFetchingEnvironment,
    clazz: KClass<T>
  ): List<T> {
    val criteriaQuery = createQueryBuilder(clazz)
    return executeQueryBuilder(criteriaQuery, page, size, environment, clazz)
  }

  fun <T : Any> createQueryBuilder(clazz: KClass<T>): CriteriaQuery<T> {
    val criteriaQuery = em.criteriaBuilder.createQuery(clazz.java)
    val root = criteriaQuery.from(clazz.java)
    criteriaQuery.select(root)

    return criteriaQuery
  }

  fun <T : Any> executeQueryBuilder(
    criteriaQuery: CriteriaQuery<T>,
    offset: Int?,
    size: Int?,
    environment: DataFetchingEnvironment,
    clazz: KClass<T>
  ): List<T> {
    val graph = createGraph(environment, clazz)

    return em.createQuery(criteriaQuery)
      .setHint(GraphSemantic.LOAD.jpaHintName, graph)
      .setFirstResult(offset ?: 0)
      .setMaxResults(size ?: 10)
      .resultList
  }

  public fun createGraphFindProperties(environment: DataFetchingEnvironment, clazz: KClass<*>): Map<String, Any> =
    mapOf(
      GraphSemantic.LOAD.jpaHintName to createGraph(environment, clazz)
    )

  public fun createGraph(environment: DataFetchingEnvironment, clazz: KClass<*>): EntityGraph<*> {
    val graph = em.createEntityGraph(clazz.java)
    // Glob * will only select first level
    environment.selectionSet.getFields("*").forEach {
      if (it.selectionSet.fields.any()) {
        logger.info("Adding subgraph for ${it.name}")
        buildSubGraph(it.selectionSet, graph.addSubgraph<Any>(it.name))
      }
    }

    return graph
  }

  private fun buildSubGraph(selectionSet: DataFetchingFieldSelectionSet, graph: Subgraph<Any>) {
    selectionSet.getFields("*").forEach {
      if (it.selectionSet.fields.any()) {
        logger.info("Adding subgraph for ${it.name}")
        buildSubGraph(it.selectionSet, graph.addSubgraph<Any>(it.name))
      }
    }
  }
}
