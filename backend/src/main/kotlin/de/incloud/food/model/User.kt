package de.incloud.food.model

import org.springframework.data.jpa.repository.JpaRepository
import java.security.MessageDigest
import java.util.UUID
import javax.persistence.Column
import javax.persistence.Entity
import javax.persistence.FetchType
import javax.persistence.JoinColumn
import javax.persistence.ManyToOne
import javax.xml.bind.DatatypeConverter

@Entity
data class User(
  @Column(nullable = false)
  var firstName: String,

  @Column(nullable = false)
  var lastName: String,

  @Column(nullable = false)
  var email: String,

  @Column(nullable = false, columnDefinition = "bigint default 1")
  var hitCount: Long = 1,

  @Column(nullable = false, columnDefinition = "bigint default 1")
  var participateCount: Long = 1
) : Node() {
  @ManyToOne(fetch = FetchType.EAGER)
  @JoinColumn()
  var site: Site? = null

  fun avatarUrl(): String {
    val bytes = MessageDigest.getInstance("MD5").digest(email.toByteArray())
    val hash = DatatypeConverter.printHexBinary(bytes).lowercase()

    return "https://www.gravatar.com/avatar/$hash"
  }

  fun fullName() = "$firstName $lastName"

  fun lotteryRatio() = participateCount.toDouble() / hitCount.toDouble()
}

interface UserRepository : JpaRepository<User, UUID> {
  fun findDistinctByEmail(email: String): User?
}
