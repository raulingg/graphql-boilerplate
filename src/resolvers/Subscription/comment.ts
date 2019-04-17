import { GraphQLResolveInfo } from 'graphql'
import IAppContext from '../../types/IAppContext'

const comment = {
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
  }
}

export default comment
