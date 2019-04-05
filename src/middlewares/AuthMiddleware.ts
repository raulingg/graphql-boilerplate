import { rule, shield } from 'graphql-shield'
import AuthProvider from '../app/auth/providers/auth.provider'
import { ModuleContext } from '@graphql-modules/core'

const isAuthenticated = rule()(
  (parent, args, { injector }: ModuleContext, info) => {
    try {
      const currentUser = injector.get(AuthProvider).getCurrentUser()

      return true
    } catch (error) {
      console.log(error.message)
      return false
    }
  }
)

const rules = shield({
  Query: {
    me: isAuthenticated,
    users: isAuthenticated
  },
  Mutation: {
    updateMe: isAuthenticated,
    deleteUser: isAuthenticated,
    createPost: isAuthenticated,
    updatePost: isAuthenticated,
    deletePost: isAuthenticated,
    createComment: isAuthenticated,
    updateComment: isAuthenticated,
    deleteComment: isAuthenticated
  },
  Subscription: {
    myPost: isAuthenticated
  }
})

export default rules
