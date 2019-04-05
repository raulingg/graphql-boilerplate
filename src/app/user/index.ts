import 'graphql-import-node'
import { GraphQLModule } from '@graphql-modules/core'
import * as typeDefs from './schema.graphql'
import resolvers from './resolvers'
import AuthModule from '../auth'
import UserProvider from './providers/user.provider'
import CommonModule from '../../common'
import { ProviderScope } from '@graphql-modules/di'

const UserModule = new GraphQLModule({
  name: 'UserModule',
  imports: () => [CommonModule],
  providers: () => [UserProvider],
  defaultProviderScope: ProviderScope.Session,
  typeDefs,
  resolvers
})

export default UserModule
