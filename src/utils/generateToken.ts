import { sign } from 'jsonwebtoken'

const secret: string = process.env.JWT_SECRET || ''

const generateToken = (payload: object): Promise<any> =>
  new Promise((resolve, reject) => {
    sign(payload, secret, { expiresIn: '7 days' }, (err, encoded) => {
      if (err) {
        reject(err)
      } else {
        resolve(encoded)
      }
    })
  })

export default generateToken
