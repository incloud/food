package de.incloud.food.graphql.mutation

import com.expediagroup.graphql.generator.extensions.get
import com.expediagroup.graphql.generator.scalars.ID
import com.expediagroup.graphql.server.operations.Mutation
import de.incloud.food.graphql.error.UnauthorizedErrorException
import de.incloud.food.model.EventOrder
import de.incloud.food.model.EventOrderRepository
import de.incloud.food.model.EventRepository
import de.incloud.food.model.User
import graphql.schema.DataFetchingEnvironment
import org.springframework.data.repository.findByIdOrNull
import org.springframework.stereotype.Component
import java.time.Instant
import java.util.UUID

// TODO: Validation
class CreateEventOrderMutationInput(
  val text: String,
  val event: ID,
  val availableForLottery: Boolean
)

class UpdateEventOrderMutationInput(
  val id: ID,
  val text: String,
  val availableForLottery: Boolean
)

@Component
class EventOrderMutation(
  private val eventRepository: EventRepository,
  private val eventOrderRepository: EventOrderRepository,
) : Mutation {
  fun createEventOrder(
    input: CreateEventOrderMutationInput,
    environment: DataFetchingEnvironment,
  ): EventOrder {
    val event = eventRepository.findByIdOrNull(UUID.fromString(input.event.toString()))
      ?: throw Exception("Event not found")

    val eventOrder = EventOrder(
      text = input.text,
      availableForLottery = input.availableForLottery,
      event = event,
      createdBy = environment.graphQlContext.get<User>() ?: throw UnauthorizedErrorException(),
    )

    eventOrderRepository.save(eventOrder)

    return eventOrder
  }

  fun updateEventOrder(input: UpdateEventOrderMutationInput, environment: DataFetchingEnvironment): EventOrder {
    /**
     * This will break when a user queries for createdBy, as it is not fetch joined
     * TODO: Figure out how to pass dynamic query hints here
     */
    val eventOrder = eventOrderRepository.findByUuidAndCreatedBy(
      UUID.fromString(input.id.toString()),
      environment.graphQlContext.get<User>() ?: throw UnauthorizedErrorException(),
    )
      ?: throw Exception("Event order not found")

    eventOrder.text = input.text
    eventOrder.availableForLottery = input.availableForLottery
    eventOrder.updatedAt = Instant.now().epochSecond

    eventOrderRepository.save(eventOrder)

    return eventOrder
  }

  fun deleteEventOrder(id: ID, environment: DataFetchingEnvironment): Boolean {
    val eventOrder = eventOrderRepository.findByUuidAndCreatedBy(
      UUID.fromString(id.toString()),
      environment.graphQlContext.get<User>() ?: throw UnauthorizedErrorException(),
    )
      ?: throw Exception("Event order not found")

    eventOrderRepository.delete(eventOrder)

    return true
  }
}
