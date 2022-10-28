package de.incloud.food.service

import com.expediagroup.graphql.generator.extensions.getOrThrow
import de.incloud.food.dto.card.ActionOpenUrl
import de.incloud.food.dto.card.AdaptiveCard
import de.incloud.food.dto.card.Fact
import de.incloud.food.dto.card.FactSet
import de.incloud.food.dto.card.TextBlock
import de.incloud.food.dto.card.TextSize
import de.incloud.food.dto.card.TextWeight
import de.incloud.food.model.Event
import de.incloud.food.model.Restaurant
import de.incloud.food.model.Site
import graphql.schema.DataFetchingEnvironment
import kotlinx.serialization.encodeToString
import kotlinx.serialization.json.Json
import org.apache.logging.log4j.kotlin.Logging
import org.springframework.http.HttpHeaders
import org.springframework.http.MediaType
import org.springframework.stereotype.Service
import org.springframework.web.reactive.function.BodyInserters
import org.springframework.web.reactive.function.client.WebClient
import org.springframework.web.reactive.function.client.awaitBodilessEntity
import org.springframework.web.reactive.function.server.ServerRequest

@Service
class TeamsNotificationService {
  companion object : Logging

  suspend fun sendEventNewNotification(event: Event, environment: DataFetchingEnvironment) {
    val card = AdaptiveCard(
      "1.4",
      mutableListOf(
        TextBlock("Someone Is Hungry!", weight = TextWeight.Bolder, size = TextSize.Large),
        TextBlock("${event.createdBy.fullName()} just created the event *${event.name}*."),
      ),
      mutableListOf(
        getViewEventAction(event, environment, "Add Your Order")
      )
    )

    val description = event.description
    if (description != null) {
      card.body.add(TextBlock("*$description*"))
    }

    card.body.add(getRestaurantFactSet(event.restaurant))

    sendNotification(event.restaurant.site, card)
  }

  suspend fun sendEventClosedNotification(event: Event, environment: DataFetchingEnvironment) {
    val card = AdaptiveCard(
      "1.4",
      mutableListOf(
        TextBlock("Order the Food Now!", weight = TextWeight.Bolder, size = TextSize.Large),
        TextBlock("The event *${event.name}* is closed now."),
      ),
      mutableListOf(
        getViewEventAction(event, environment)
      )
    )

    val lotteryWinner = event.lotteryWinner
    if (lotteryWinner != null) {
      card.body.add(TextBlock("**${lotteryWinner.fullName()}** has been selected to order the food."))
    }

    card.body.add(getRestaurantFactSet(event.restaurant))

    val orderHeading = TextBlock("The following items need to be ordered:")
    orderHeading.separator = true
    card.body.add(orderHeading)

    // Teams does not yet support AdaptiveCard v1.5, therefore a FactSet is used instead of a real table.
    val orderTable = FactSet()
    event.orders.forEach { orderTable.facts.add(Fact(it.text, it.createdBy.fullName())) }
    card.body.add(orderTable)

    sendNotification(event.restaurant.site, card)
  }

  private fun getRestaurantFactSet(restaurant: Restaurant): FactSet {
    val factSet = FactSet(
      mutableListOf(
        Fact("Restaurant", restaurant.name),
        Fact("Delivery possible", if (restaurant.delivery) "Yes" else "**No**"),
      )
    )

    factSet.separator = true

    val phone = restaurant.phone
    if (phone != null) {
      factSet.facts.add(Fact("Phone", if (phone.startsWith('+')) "[$phone](tel:$phone)" else phone))
    }

    val website = restaurant.website
    if (website != null) {
      factSet.facts.add(Fact("Website", "[$website]($website)"))
    }

    return factSet
  }

  private fun getViewEventAction(event: Event, environment: DataFetchingEnvironment, text: String = "View Event"): ActionOpenUrl {
    val request = environment.graphQlContext.getOrThrow<ServerRequest>()
    return ActionOpenUrl(text, event.url(request.uri()))
  }

  private suspend fun sendNotification(site: Site, data: AdaptiveCard) {
    val url = site.teamsWebhookUrl
    if (url == null) {
      logger.info("Not sending teams notification, because site \"${site.name}\" has no webhook url configured.")
      return
    }

    val adaptiveCardJson = Json.encodeToString(data)

    // See: https://stackoverflow.com/a/68203359
    val body = "{ \"type\": \"message\", \"attachments\": [{ \"contentType\": \"application/vnd.microsoft.card.adaptive\", \"contentUrl\": null, \"content\": $adaptiveCardJson }] }"

    logger.info("Sending teams notification, for site \"${site.name}\": $body")

    try {
      WebClient
        .create(url)
        .post()
        .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
        .header(HttpHeaders.ACCEPT, MediaType.APPLICATION_JSON_VALUE)
        .body(BodyInserters.fromValue(body))
        .retrieve()
        .awaitBodilessEntity()
    } catch (e: Exception) {
      logger.error("Error sending notification to teams for site \"${site.name}\"", e)
    }
  }
}
