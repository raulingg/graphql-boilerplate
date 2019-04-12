import { GraphQLServer } from 'graphql-yoga'
import { makeExecutableSchema } from 'graphql-tools'
import { importSchema } from 'graphql-import'
import { resolvers } from './resolvers'
import { ConstraintDirective, TrimDirective } from './directives'
import { AuthMiddleware, PermissionsMiddleware } from './middlewares'
import db from './prisma'
import depthLimit from 'graphql-depth-limit'
import IAppContext from './interfaces/IAppContext'
import IRequest from './interfaces/IRequest'

const schema = makeExecutableSchema({
  typeDefs: importSchema('./src/schema.graphql'),
  resolvers
})

const server = new GraphQLServer({
  schema,
  schemaDirectives: { TrimDirective, ConstraintDirective },
  middlewares: [AuthMiddleware, PermissionsMiddleware],
  context: (request: IRequest): IAppContext => ({
    request,
    db
  })
})

const port = process.env.PORT || 4000
const options = {
  port,
  validationRules: [depthLimit(5)],
  formatError: (error: any) => {
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
