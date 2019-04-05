import { isURL } from 'validator'
import { GraphQLError } from 'graphql'

const uri = (value: string) => {
  if (isURL(value)) return true

  throw new GraphQLError('Must be in URI format')
}

export default uri
