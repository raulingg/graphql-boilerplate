import { GraphQLResolveInfo } from 'graphql'

const TrimMiddleware = (
  resolve: Function,
  root: any,
  args: any,
  context: any,
  info: GraphQLResolveInfo
) => {
  if (!args.data) {
    return resolve(root, args, context, info)
  }

  const argsTrimmed = { ...args }
  const { data } = argsTrimmed

  for (const property in data) {
    if (typeof data[property] !== 'string') {
      continue
    }

    argsTrimmed.data[property] = data[property].trim()
  }

  return resolve(root, argsTrimmed, context, info)
}

export default TrimMiddleware
