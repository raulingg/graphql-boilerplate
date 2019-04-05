import { GraphQLModule } from '@graphql-modules/core'
import { constraint, trim } from './directives'
import PrismaBinding from './providers/prisma.provider'

const CommonModule = new GraphQLModule({
  name: 'CommonModule',
  providers: () => [PrismaBinding],
  schemaDirectives: {
    constraint,
    trim
  }
})

export default CommonModule
