import IAppContext from '../../types/IAppContext'
import { GraphQLResolveInfo } from 'graphql'

const post = {
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

export default post
