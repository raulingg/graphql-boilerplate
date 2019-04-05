import { rule, shield, or } from 'graphql-shield'
import AuthProvider from '../app/auth/providers/auth.provider'
import PrismaBinding from '../common/providers/prisma.provider'
import { ModuleContext } from '@graphql-modules/core'

const isAdmin = rule()(async (parent, args, { injector }: ModuleContext) => {
  let currentUser
  try {
    currentUser = injector.get(AuthProvider).getCurrentUser()
  } catch (error) {
    console.log(error.message)
    return false
  }

  return currentUser.role === 'Admin'
})

/**
 *
 * @param on Table o Collection name
 * @param relationship  Field name related to owner (i.e user, owner, author)
 */
const isOwner = (on: string, field: string) =>
  rule({ cache: 'no_cache' })(async (next, args, ctx: ModuleContext) => {
    const { id: resourceId } = args || { id: null }
    const currentUser = ctx.injector.get(AuthProvider).getCurrentUser()
    if (on === 'User') {
      return currentUser.id === resourceId
    } else {
      const isOwner = await ctx.injector.get(PrismaBinding).db.exists[on]({
        id: resourceId,
        [field]: { id: currentUser.id }
      })
      return isOwner
    }
  })

const rules = shield({
  Query: {
    users: isAdmin
  },
  Mutation: {
    deleteUser: isAdmin,
    updateUser: isAdmin,
    updatePost: or(isAdmin, isOwner('Post', 'author')),
    deletePost: or(isAdmin, isOwner('Post', 'author')),
    updateComment: or(isAdmin, isOwner('Comment', 'author')),
    deleteComment: or(isAdmin, isOwner('Comment', 'author'))
  }
})

export default rules
