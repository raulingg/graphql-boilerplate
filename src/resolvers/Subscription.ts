import { GraphQLResolveInfo } from 'graphql'
import IAppContext from '../interfaces/IAppContext'

const Subscription = {
  comment: {
    subscribe(
      _,
      { postId }: { postId: string },
      { db }: IAppContext,
      info: GraphQLResolveInfo
    ) {
      return db.subscription.comment(
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
    subscribe(_, __, { db }: IAppContext, info: GraphQLResolveInfo) {
      return db.subscription.post(
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
    subscribe(_, __, { db, user }: IAppContext, info: GraphQLResolveInfo) {
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

export { Subscription as default }
