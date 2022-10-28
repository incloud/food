package de.incloud.food.dto.card

import kotlinx.serialization.EncodeDefault
import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable

@Serializable
sealed class CardElement {
  /**
   * 	When true, draw a separating line at the top of the element.
   */
  var separator: Boolean = false
}

@Serializable
sealed interface Action

@Serializable
class TeamsOptions {
  @EncodeDefault
  var width: String = "Full"
}

@Serializable
data class AdaptiveCard(
  var version: String,
  var body: MutableList<CardElement> = mutableListOf(),
  var actions: MutableList<Action> = mutableListOf()
) {
  @EncodeDefault
  val type = "AdaptiveCard"

  @SerialName("\$schema")
  @EncodeDefault
  val schema = "http://adaptivecards.io/schemas/adaptive-card.json"

  @EncodeDefault
  val msteams = TeamsOptions()
}

@Serializable
@SerialName("ColumnSet")
data class ColumnSet(var columns: MutableList<Column> = mutableListOf()) : CardElement()

enum class ColumnWidth(val width: String) {
  Auto("auto"),
  Stretch("stretch"),
}

@Serializable
data class Column(var items: MutableList<CardElement> = mutableListOf(), var width: ColumnWidth = ColumnWidth.Auto) {
  @EncodeDefault
  val type = "Column"
}

@Serializable
@SerialName("FactSet")
data class FactSet(var facts: MutableList<Fact> = mutableListOf()) : CardElement()

@Serializable
data class Fact(var title: String, var value: String)

enum class TextWeight {
  Lighter,
  Default,
  Bolder,
}

enum class TextSize {
  Small,
  Default,
  Medium,
  Large,
  ExtraLarge,
}

/**
 * Not supported in v1.4
 */
enum class TextBlockStyle {
  @SerialName("default") Default,
  @SerialName("heading") Heading,
}

enum class Color {
  @SerialName("default") Default,
  @SerialName("dark") Dark,
  @SerialName("light") Light,
  @SerialName("accent") Accent,
  @SerialName("good") Good,
  @SerialName("warning") Warning,
  @SerialName("attention") Attention,
}

@Serializable
@SerialName("TextBlock")
data class TextBlock(
  var text: String,
  var weight: TextWeight = TextWeight.Default,
  var size: TextSize = TextSize.Default,
  var wrap: Boolean = false,
  var style: TextBlockStyle = TextBlockStyle.Default,
  var color: Color = Color.Default
) : CardElement()

@Serializable
@SerialName("Image")
data class Image(var url: String, var size: String? = null, var style: Boolean = false) : CardElement()

@Serializable
@SerialName("Table")
data class Table(
  var columns: MutableList<TableColumn>,
  var rows: MutableList<TableRow>,
  var firstRowAsHeaders: Boolean = true,
  var showGridLines: Boolean = true
) : CardElement()

@Serializable
data class TableColumn(var width: UInt)

@Serializable
data class TableRow(var cells: MutableList<TableCell> = mutableListOf()) {
  @EncodeDefault
  val type = "TableRow"
}

@Serializable
data class TableCell(var items: MutableList<CardElement> = mutableListOf()) {
  @EncodeDefault
  val type = "TableCell"
}

@Serializable
@SerialName("Action.OpenUrl")
data class ActionOpenUrl(var title: String, var url: String) : Action
