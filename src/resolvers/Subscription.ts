import getUserId from '../utils/getUserFromRequest'
import { GraphQLResolveInfo } from 'graphql'

const Subscription = {
  comment: {
    subscribe(
      parent: any,
      { postId }: { postId: string },
      { db }: { db: any },
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
    subscribe(
      parent: any,
      { postId }: { postId: string },
      { db }: { db: any },
      info: GraphQLResolveInfo
    ) {
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
    subscribe(
      parent: any,
      {},
      { db, request }: { db: any; request: any },
      info: GraphQLResolveInfo
    ) {
      const userId = request.userId

      return db.subscription.post(
        {
          where: {
            node: {
              author: {
                id: userId
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
