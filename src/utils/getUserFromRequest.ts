import { verify } from 'jsonwebtoken'

const getUserFromRequest = async (request: any): Promise<any> =>
  new Promise((resolve, reject) => {
    const header = request.request.headers.authorization

    if (!header) {
      reject(new Error('authorization header not supplied'))
    }

    const token = header.replace('Bearer ', '')
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

export default getUserFromRequest
