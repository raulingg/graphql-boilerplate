import UserContext from './IUserContext'
import { Prisma } from 'prisma-binding'
import IRequest from './IRequest'

export default interface IAppContext {
  request: IRequest
  db: Prisma
  user?: UserContext
}
