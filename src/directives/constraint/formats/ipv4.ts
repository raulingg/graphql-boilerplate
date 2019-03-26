import { isIP } from 'validator'
import { GraphQLError } from 'graphql'

const ipv4 = (value: string) => {
  if (isIP(value, 4)) return true

  throw new GraphQLError('Must be in IP v4 format')
}

export default ipv4
