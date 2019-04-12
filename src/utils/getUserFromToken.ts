import { verify } from 'jsonwebtoken'
import IUserContext from '../interfaces/IUserContext'

const getUserFromToken = async (token: string): Promise<IUserContext> =>
  new Promise((resolve, reject) => {
    token = token.replace('Bearer ', '')
    const secret: string = process.env.JWT_SECRET || ''

    verify(token, secret, (err: Error, decoded: any) => {
      if (err) {
        reject(err)
      } else {
        if (!decoded.user || !decoded.user.id) {
          reject(new Error('User id not found within payload'))
        }

        resolve(decoded.user)
      }
    })
  })

export default getUserFromToken
