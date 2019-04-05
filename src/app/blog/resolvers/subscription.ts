import { GraphQLResolveInfo } from 'graphql'
import { ModuleContext } from '@graphql-modules/core'
import AuthProvider from '../../auth/providers/auth.provider'

export default {
  Subscription: {
    comment: {
      subscribe(
        _,
        { postId }: { postId: string },
        ctx: ModuleContext,
        info: GraphQLResolveInfo
      ) {
        return ctx.db.subscription.comment(
          {
            where: {
              node: {
                post: {
                  id: postId
                }
              }
            }
          },
          info
        )
      }
    },
    post: {
      subscribe(_, __, ctx: ModuleContext, info: GraphQLResolveInfo) {
        return ctx.db.subscription.post(
          {
            where: {
              node: {
                published: true
              }
            }
          },
          info
        )
      }
    },
    myPost: {
      subscribe(
        _,
        __,
        { injector, db }: ModuleContext,
        info: GraphQLResolveInfo
      ) {
        const user = injector.get(AuthProvider).getCurrentUser()
        return db.subscription.post(
          {
            where: {
              node: {
                author: {
                  id: user.id
                }
              }
            }
          },
          info
        )
      }
    }
  }
}
