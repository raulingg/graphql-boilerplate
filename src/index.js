import '@babel/polyfill/noConflict'
import { GraphQLServer } from 'graphql-yoga'
import { makeExecutableSchema } from 'graphql-tools'
import { importSchema } from 'graphql-import'
import { resolvers } from './resolvers'
import { constraint, trim } from './directives'
import { auth, permission } from './middlewares'
import { prisma } from './generated/prisma-client'
import db from './prisma'
import depthLimit from 'graphql-depth-limit'

const schema = makeExecutableSchema({
  typeDefs: importSchema('./src/schema.graphql'),
  schemaDirectives: {
    trim, constraint
  },
  resolvers
})

const server = new GraphQLServer({
  schema,
  middlewares: [auth, permission],
  context: request => ({
    request,
    prisma,
    db
  })
})

const port = process.env.PORT || 4000
const options = {
  port,
  validationRules: [depthLimit(5)],
  formatError: error => {
    if (
      error.originalError &&
      error.originalError.code === 'ERR_GRAPHQL_CONSTRAINT_VALIDATION'
    ) {
      // return a custom object
    }

    return error
  }
}

server.start(options, () =>
  console.log(`Server is running on http://localhost:${port}`)
)
