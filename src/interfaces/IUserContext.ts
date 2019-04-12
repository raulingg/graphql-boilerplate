import { Role } from '../generated/prisma-client'

export default interface IUserContext {
  id: string
  role: Role
  email?: string
}
