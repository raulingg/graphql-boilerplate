import { isUUID } from 'validator'
import { GraphQLError } from 'graphql'

const uuid = (value: string) => {
  if (isUUID(value)) return true

  throw new GraphQLError('Must be in UUID format')
}

export default uuid
