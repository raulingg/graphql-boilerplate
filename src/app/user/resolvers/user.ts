import { ModuleContext } from '@graphql-modules/core'
import AuthProvider from '../../auth/providers/auth.provider'

export default {
  User: {
    email: {
      fragment: 'fragment userId on User { id }',
      resolve(parent: any, _: any, { injector }: ModuleContext) {
        let currentUser

        try {
          currentUser = injector.get(AuthProvider).getCurrentUser()
        } catch (error) {
          return null
        }

        if (currentUser.id === parent.id || currentUser.role === 'Admin')
          return parent.email

        return null
      }
    }
  }
}
