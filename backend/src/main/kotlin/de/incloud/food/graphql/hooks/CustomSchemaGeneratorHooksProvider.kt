package de.incloud.food.graphql.hooks

import com.expediagroup.graphql.generator.hooks.SchemaGeneratorHooks
import com.expediagroup.graphql.plugin.schema.hooks.SchemaGeneratorHooksProvider

// Needed for "gradle graphqlGenerateSDL" to work
class CustomSchemaGeneratorHooksProvider : SchemaGeneratorHooksProvider {
  override fun hooks(): SchemaGeneratorHooks = CustomSchemaGeneratorHooks()
}
