package de.incloud.food.graphql.mutation

import com.expediagroup.graphql.generator.extensions.get
import com.expediagroup.graphql.generator.scalars.ID
import com.expediagroup.graphql.server.operations.Mutation
import de.incloud.food.graphql.error.UnauthorizedErrorException
import de.incloud.food.model.Event
import de.incloud.food.model.EventOrder
import de.incloud.food.model.EventRepository
import de.incloud.food.model.Restaurant
import de.incloud.food.model.RestaurantRepository
import de.incloud.food.model.User
import de.incloud.food.service.MailNotificationService
import de.incloud.food.service.TeamsNotificationService
import graphql.schema.DataFetchingEnvironment
import org.hibernate.graph.GraphSemantic
import org.springframework.data.repository.findByIdOrNull
import org.springframework.stereotype.Component
import java.time.Instant
import java.util.UUID
import javax.persistence.EntityManager

// TODO: Validation
class CreateEventMutationInput(
  val name: String,
  val restaurant: ID,
  val description: String?,
)
class UpdateEventMutationInput(
  val id: ID,
  val name: String,
  val restaurant: ID,
  val active: Boolean,
  val description: String?,
)

@Component
class EventMutation(
  private val eventRepository: EventRepository,
  private val restaurantRepository: RestaurantRepository,
  private val teamsNotificationService: TeamsNotificationService,
  private val mailNotificationService: MailNotificationService,
  private val em: EntityManager,
) : Mutation {
  suspend fun createEvent(
    input: CreateEventMutationInput,
    environment: DataFetchingEnvironment,
  ): Event {
    val restaurant = restaurantRepository.findByIdOrNull(UUID.fromString(input.restaurant.toString()))
      ?: throw Exception("Restaurant not found")

    val user = environment.graphQlContext.get<User>() ?: throw UnauthorizedErrorException()

    val event = Event(
      name = input.name,
      restaurant = restaurant,
      createdBy = user,
    )

    event.description = input.description

    eventRepository.save(event)

    teamsNotificationService.sendEventNewNotification(event, environment)

    return event
  }

  suspend fun updateEvent(input: UpdateEventMutationInput, environment: DataFetchingEnvironment): Event {
    val event = eventRepository.findByIdOrNull(UUID.fromString(input.id.toString()))
      ?: throw Exception("Event not found")
    val restaurant = restaurantRepository.findByIdOrNull(UUID.fromString(input.restaurant.toString()))
      ?: throw Exception("Restaurant not found")

    event.name = input.name
    event.restaurant = restaurant
    val closed = event.active && !input.active
    event.active = input.active
    event.description = input.description
    event.updatedAt = Instant.now().epochSecond
    event.updatedBy = environment.graphQlContext.get<User>() ?: throw UnauthorizedErrorException()

    eventRepository.save(event)

    if (closed) {
      teamsNotificationService.sendEventClosedNotification(event, environment)
      mailNotificationService.sendEventClosedNotification(event, environment)
    }

    return event
  }

  suspend fun startEventLottery(id: ID, environment: DataFetchingEnvironment): Event {
    val graph = em.createEntityGraph(Event::class.java)
    graph
      .addSubgraph<EventOrder>(Event::orders.name)
      .addSubgraph<User>(EventOrder::createdBy.name)
    graph.addSubgraph<Restaurant>(Event::restaurant.name)
    graph.addSubgraph<User>(Event::createdBy.name)

    val event = em.find(
      Event::class.java,
      UUID.fromString(id.toString()),
      mapOf(
        GraphSemantic.LOAD.jpaHintName to graph
      )
    ) ?: throw Exception("Event not found")

    if (!event.active) {
      throw Exception("Event is already closed!")
    }

    val lottery = event.orders.filter { eventOrder -> eventOrder.availableForLottery }

    if (lottery.isEmpty()) {
      throw Exception("Nobody is available for lottery!")
    }

    val lotteryWinner = lottery.random().createdBy

    event.active = false
    event.updatedAt = Instant.now().epochSecond
    event.updatedBy = environment.graphQlContext.get<User>() ?: throw UnauthorizedErrorException()
    event.lotteryWinner = lotteryWinner

    eventRepository.save(event)

    teamsNotificationService.sendEventClosedNotification(event, environment)
    mailNotificationService.sendEventClosedNotification(event, environment)

    return event
  }
}
