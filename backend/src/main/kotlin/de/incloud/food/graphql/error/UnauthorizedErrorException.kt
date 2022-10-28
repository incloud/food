package de.incloud.food.graphql.error

import graphql.GraphqlErrorException

class UnauthorizedErrorException : GraphqlErrorException(newErrorException().message("Unauthorized"))
