import { isISO8601 } from 'validator'
import { GraphQLError } from 'graphql'

const date = (value: string) => {
  if (isISO8601(value)) return true

  throw new GraphQLError('Must be a date in ISO 8601 format')
}

export default date
