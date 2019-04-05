import { isBase64 } from 'validator'
import { GraphQLError } from 'graphql'

const byte = (value: string) => {
  if (isBase64(value)) return true

  throw new GraphQLError('Must be in byte format')
}

export default byte
