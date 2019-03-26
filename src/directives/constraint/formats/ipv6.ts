import { isIP } from 'validator'
import { GraphQLError } from 'graphql'

const ipv6 = (value: string) => {
  if (isIP(value, 6)) return true

  throw new GraphQLError('Must be in IP v6 format')
}

export default ipv6
