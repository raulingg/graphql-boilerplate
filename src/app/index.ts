import { GraphQLModule } from '@graphql-modules/core'
import AuthModule from './auth'
import UserModule from './user'
import BlogModule from './blog'
import CommonModule from '../common'

export const AppModule = new GraphQLModule({
  name: 'AppModule',
  imports: () => [CommonModule, UserModule, AuthModule, BlogModule]
})
