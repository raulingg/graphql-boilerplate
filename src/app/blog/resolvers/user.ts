import { ModuleContext } from '@graphql-modules/core'
import AuthProvider from '../../auth/providers/auth.provider'

export default {
  User: {
    posts: (parent, _, { injector }: ModuleContext) => {
      let currentUser

      try {
        currentUser = injector.get(AuthProvider).getCurrentUser()
      } finally {
        const posts = (parent && parent.posts) || []

        if (currentUser && currentUser.role === 'Admin') {
          return posts
        }

        return posts.filter((post: any) => post.published)
      }
    }
  }
}
