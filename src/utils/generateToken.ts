import { sign } from 'jsonwebtoken'

const generateToken = (payload: object): Promise<any> =>
  new Promise((resolve, reject) => {
    const secret: string = process.env.JWT_SECRET || ''

    sign(payload, secret, { expiresIn: '7 days' }, (err, encoded) => {
      if (err) {
        reject(err)
      } else {
        resolve(encoded)
      }
    })
  })

export default generateToken
