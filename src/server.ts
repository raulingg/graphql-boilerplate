import '@babel/polyfill/noConflict'
import { GraphQLServer } from 'graphql-yoga'
import { auth, permission } from './middlewares'
import depthLimit from 'graphql-depth-limit'
import { GraphQLModule } from '@graphql-modules/core'
import { SchemaDirectiveVisitor } from 'graphql-tools'

export function bootstrap(AppModule: GraphQLModule) {
  const { schema, context, schemaDirectives, subscriptions } = AppModule
  SchemaDirectiveVisitor.visitSchemaDirectives(schema, schemaDirectives)

  const server = new GraphQLServer({
    schema,
    middlewares: [auth, permission],
    context
  })
  const port = process.env.PORT || 4000
  const options = {
    subscriptions,
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
}
