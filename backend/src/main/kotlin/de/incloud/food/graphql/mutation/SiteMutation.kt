package de.incloud.food.graphql.mutation

import com.expediagroup.graphql.generator.extensions.get
import com.expediagroup.graphql.generator.scalars.ID
import com.expediagroup.graphql.server.operations.Mutation
import de.incloud.food.graphql.error.UnauthorizedErrorException
import de.incloud.food.graphql.query.Resolver
import de.incloud.food.model.Site
import de.incloud.food.model.SiteRepository
import de.incloud.food.model.User
import de.incloud.food.model.Webhook
import de.incloud.food.model.WebhookRepository
import graphql.schema.DataFetchingEnvironment
import org.springframework.data.repository.findByIdOrNull
import org.springframework.stereotype.Component
import java.util.UUID

class CreateWebhookMutationInput(val name: String, val url: String)

class UpdateWebhookMutationInput(val id: ID?, val name: String, val url: String)

class CreateSiteMutationInput(val name: String, val webhooks: List<CreateWebhookMutationInput>)

class UpdateSiteMutationInput(val id: ID, val name: String, val webhooks: List<UpdateWebhookMutationInput>)

@Component
class SiteMutation(
  private val resolver: Resolver,
  private val siteRepository: SiteRepository,
  private val webhookRepository: WebhookRepository
) : Mutation {
  fun createSite(input: CreateSiteMutationInput, environment: DataFetchingEnvironment): Site {
    environment.graphQlContext.get<User>() ?: throw UnauthorizedErrorException()

    val site = Site(name = input.name)

    siteRepository.save(site)

    val webhooks = input.webhooks.map {
      Webhook(name = it.name, url = it.url, site)
    }

    webhookRepository.saveAll(webhooks)

    return site
  }

  fun updateSite(input: UpdateSiteMutationInput, environment: DataFetchingEnvironment): Site {
    environment.graphQlContext.get<User>() ?: throw UnauthorizedErrorException()
    var site = siteRepository.findByIdOrNull(UUID.fromString(input.id.toString())) ?: throw Exception("Site not found")

    site.name = input.name
    val webhooksToRemove = site.webhooks.filter { webhook ->
      input.webhooks.any {
        it.id != null && it.id != webhook.id()
      }
    }.toMutableList()

    val updatedWebhookData = input.webhooks.filter { webhook -> webhook.id != null }
    val updatedWebhooks = updatedWebhookData.map {
      webhook ->
      val existingWebhook = webhookRepository.findByIdOrNull(UUID.fromString(webhook.id.toString()))
      if (existingWebhook != null) {
        existingWebhook.name = webhook.name
        existingWebhook.url = webhook.url
      }

      return@map existingWebhook
    }

    webhookRepository.saveAll(updatedWebhooks)

    val newWebhooks = input.webhooks.filter { webhook -> webhook.id == null }
    val webhooksToAdd = newWebhooks.map {
      Webhook(it.name, it.url, site)
    }

    if (input.webhooks.isEmpty() && site.webhooks.isNotEmpty()) {
      val loadedWebhooks = webhookRepository.findAllById(site.webhooks.map { it.uuid })
      webhooksToRemove.addAll(loadedWebhooks)
    }

    if (webhooksToRemove.isNotEmpty()) {
      webhookRepository.deleteAll(webhooksToRemove)
    }

    if (webhooksToAdd.isNotEmpty()) {
      webhookRepository.saveAll(webhooksToAdd)
    }

    site = siteRepository.findByIdOrNull(UUID.fromString(input.id.toString())) ?: throw Exception("Site not found")
    siteRepository.save(site)

    return site
  }
}
