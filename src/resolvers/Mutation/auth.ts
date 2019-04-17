import { generateToken } from '../../utils'
import { UserCreateInput } from '../../generated/prisma-client'
import IAppContext from '../../types/IAppContext'
import bcrypt from 'bcryptjs'

const auth = {
  signup: async (
    _,
    { data }: { data: UserCreateInput },
    { db }: IAppContext
  ) => {
    const password = await bcrypt.hash(data.password, 10)
    const user = await db.mutation.createUser(
      {
        data: {
          ...data,
          password,
          role: 'User'
        }
      },
      '{id, role}'
    )

    return {
      token: await generateToken({ user: { id: user.id, role: user.role } })
    }
  },
  login: async (_, args, { db }: IAppContext) => {
    const user = await db.query.user(
      {
        where: {
          email: args.data.email
        }
      },
      '{ id, role, password}'
    )

    if (!user) {
      throw new Error('User does not exits')
    }

    const isMatch = await bcrypt.compare(args.data.password, user.password)

    if (!isMatch) {
      throw new Error('Password does not match')
    }

    return {
      token: await generateToken({ user: { id: user.id, role: user.role } })
    }
  }
}

export default auth
