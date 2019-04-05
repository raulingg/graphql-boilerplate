import extractModulesFragments from '../../utils/extractModulesFragments'
import { ProviderScope, Injectable } from '@graphql-modules/di'
import { Prisma } from 'prisma-binding'

@Injectable()
export default class PrismaBinding {
  /**
   * Prisma Binding instance
   */
  db: Prisma

  constructor() {
    console.log('instancia')
    const fragmentReplacements = extractModulesFragments()
    this.db = new Prisma({
      typeDefs: __dirname + '/../../generated/prisma.graphql',
      endpoint: process.env.PRISMA_ENDPOINT,
      secret: process.env.PRISMA_SECRET,
      fragmentReplacements
    })
  }
}
