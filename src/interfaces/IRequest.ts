import { Request, Response } from 'express'

export default interface IRequest {
  request: Request
  response: Response
  connection?: any
}
