package de.incloud.food.fixtures

import de.incloud.food.model.Event
import de.incloud.food.model.EventOrder
import de.incloud.food.model.EventOrderRepository
import de.incloud.food.model.EventRepository
import org.springframework.stereotype.Component
import kotlin.random.Random

@Component
class EventFixtures(
  private val eventRepository: EventRepository,
  private val eventOrderRepository: EventOrderRepository,
) {

  fun load() {
    val names = listOf(
      "Mittagessen",
      "Lunch",
      "Spätes Frühstück",
      "Frühes Abendessen",
      "Brot für die Welt",
      "Essen gegen den Hunger"
    )

    val events = mutableListOf<Event>()
    val eventOrders = mutableListOf<EventOrder>()

    for (i in 1..100) {
      val event = Event(
        name = names.random(),
        restaurant = RestaurantFixtures.restaurants.random(),
        createdBy = UserFixtures.users.random()
      )
      events.add(event)

      for (j in 0..Random.nextInt(0, 10)) {
        eventOrders.add(
          EventOrder(
            event = event,
            text = Random.nextInt(100, 999).toString(),
            createdBy = UserFixtures.users.random(),
            availableForLottery = Random.nextBoolean()
          )
        )
      }
    }

    eventRepository.saveAll(events)
    eventOrderRepository.saveAll(eventOrders)
  }
}
