package de.incloud.food.filters

import com.fasterxml.jackson.databind.ObjectMapper
import org.springframework.context.ApplicationContext
import org.springframework.context.annotation.Profile
import org.springframework.core.annotation.Order
import org.springframework.core.io.ByteArrayResource
import org.springframework.http.HttpStatus
import org.springframework.http.MediaType
import org.springframework.stereotype.Component
import org.springframework.web.reactive.function.client.ExchangeStrategies
import org.springframework.web.reactive.function.client.WebClient
import org.springframework.web.server.ResponseStatusException
import org.springframework.web.server.ServerWebExchange
import org.springframework.web.server.WebFilter
import org.springframework.web.server.WebFilterChain
import reactor.core.publisher.Mono

@Order(-2)
@Component
@Profile("!dev")
class ServeStaticFrontendFilter(
  private val objectMapper: ObjectMapper,
  private val applicationContext: ApplicationContext
) : WebFilter {
  override fun filter(exchange: ServerWebExchange, chain: WebFilterChain): Mono<Void> {
    return chain.filter(exchange).onErrorResume {
      Mono.defer {
        if (it is ResponseStatusException && it.status == HttpStatus.NOT_FOUND) {
          val bytes =
            try {
              val resource = applicationContext.getResource("classpath:static/index.html")
              exchange.response.statusCode = HttpStatus.OK
              exchange.response.headers.contentType = MediaType.TEXT_HTML
              resource.inputStream.readAllBytes()
            } catch (e: Exception) {
              exchange.response.statusCode = HttpStatus.INTERNAL_SERVER_ERROR
              exchange.response.headers.contentType = MediaType.TEXT_PLAIN
              objectMapper.writeValueAsBytes("Frontend Not Found")
            }
          val buffer = exchange.response.bufferFactory().wrap(bytes)
          exchange.response.writeWith(Mono.just(buffer))
        } else {
          throw it
        }
      }
    }
  }
}

@Order(-2)
@Component
@Profile("dev")
class ServeDevelopementFrontendFilter(
  private val objectMapper: ObjectMapper,
  private val applicationContext: ApplicationContext
) : WebFilter {
  override fun filter(exchange: ServerWebExchange, chain: WebFilterChain): Mono<Void> {
    return chain.filter(exchange).onErrorResume { ex ->
      if (ex is ResponseStatusException && ex.status == HttpStatus.NOT_FOUND) {
        WebClient.builder()
          .exchangeStrategies(
            ExchangeStrategies.builder()
              .codecs {
                // increase limit on data in databuffer, because .js files can be huge
                it.defaultCodecs().maxInMemorySize(64 * 1024 * 1024)
              }
              .build()
          )
          .build()
          .get()
          .uri("http://frontend:3000" + exchange.request.path)
          .exchange()
          .map {
            exchange.response.statusCode = it.statusCode()
            exchange.response.headers.contentType =
              it.headers().contentType().orElse(MediaType.TEXT_HTML)
            it
          }
          .flatMap { it.bodyToMono(ByteArrayResource::class.java) }
          .map(ByteArrayResource::getByteArray)
          .flatMap {
            val buffer = exchange.response.bufferFactory().wrap(it)
            exchange.response.writeWith(Mono.just(buffer))
          }
      } else {
        throw ex
      }
    }
  }
}
