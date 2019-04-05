import 'graphql-import-node'
import { GraphQLModule } from '@graphql-modules/core'
import * as typeDefs from './schema.graphql'
import resolvers from './resolvers'
import AuthModule from '../auth'
import UserModule from '../user'
import PostProvider from './providers/post.provider'
import CommonModule from '../../common'

const BlogModule = new GraphQLModule({
  name: 'BlogModule',
  imports: () => [UserModule, AuthModule],
  providers: () => [PostProvider],
  typeDefs,
  resolvers
})

export default BlogModule
