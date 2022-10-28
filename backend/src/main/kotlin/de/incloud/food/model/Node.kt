package de.incloud.food.model

import com.expediagroup.graphql.generator.annotations.GraphQLIgnore
import com.expediagroup.graphql.generator.scalars.ID
import java.util.UUID
import javax.persistence.Column
import javax.persistence.Id
import javax.persistence.MappedSuperclass

@MappedSuperclass
abstract class Node {
  @Id
  @Column(name = "id", length = 16, unique = true, nullable = false)
  @GraphQLIgnore
  val uuid: UUID = UUID.randomUUID()

  fun id(): ID = ID(uuid.toString())
}
