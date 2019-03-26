import { isEmail } from 'validator'
import { GraphQLError } from 'graphql'

const email = (value: string): boolean => {
  if (isEmail(value)) return true

  throw new GraphQLError('Must be in email format')
}

export default email
