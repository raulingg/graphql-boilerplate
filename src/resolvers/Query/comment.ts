import IAppContext from '../../types/IAppContext'
import { GraphQLResolveInfo } from 'graphql'

const comment = {
  comments: (_, args, { db }: IAppContext, info: GraphQLResolveInfo) =>
    db.query.comments(args, info)
}

export default comment
