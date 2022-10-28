package de.incloud.food.service

import com.expediagroup.graphql.generator.extensions.getOrThrow
import de.incloud.food.model.Event
import graphql.schema.DataFetchingEnvironment
import org.apache.logging.log4j.kotlin.Logging
import org.springframework.mail.SimpleMailMessage
import org.springframework.mail.javamail.JavaMailSender
import org.springframework.stereotype.Service
import org.springframework.web.reactive.function.server.ServerRequest

@Service
class MailNotificationService(private val mailSender: JavaMailSender) {
  companion object : Logging

  suspend fun sendEventClosedNotification(event: Event, environment: DataFetchingEnvironment) {
    val lotteryWinner = event.lotteryWinner ?: return

    var orderString = "\n"
    for (order in event.orders) {
      orderString += "      - ${order.text} (${order.createdBy.firstName} ${order.createdBy.lastName})\n"
    }

    var restaurantString = event.restaurant.name
    if (event.restaurant.phone != null) {
      restaurantString += ", phone number ${event.restaurant.phone}"
    }
    if (event.restaurant.website != null) {
      restaurantString += ", website ${event.restaurant.website}"
    }

    val url = event.url(environment.graphQlContext.getOrThrow<ServerRequest>().uri())

    val message = SimpleMailMessage()
    message.setTo(lotteryWinner.email)
    message.setSubject("Order the food now!")
    message.setText(
      """
      Hello ${lotteryWinner.firstName},

      you got selected for ordering the food for "${event.name}" at "$restaurantString".

      The ordered items are: $orderString
      Open the event at: $url

      Enjoy your meal!
      """.trimIndent()
    )

    logger.info("Sending email notification to ${lotteryWinner.email}")

    try {
      mailSender.send(message)
    } catch (e: Exception) {
      logger.error("Error sending mail notification", e)
    }
  }
}
