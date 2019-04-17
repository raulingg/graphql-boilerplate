import IAppContext from '../../types/IAppContext'
import { GraphQLResolveInfo } from 'graphql'

const user = {
  me: (_, __, { db, user }: IAppContext, info: GraphQLResolveInfo) =>
    db.query.user(
      {
        where: {
          id: user.id
        }
      },
      info
    ),
  users: (_, args, { db }: IAppContext, info: GraphQLResolveInfo) =>
    db.query.users(args, info)
}

export default user
