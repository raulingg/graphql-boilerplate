import { Prisma } from 'prisma-binding'
import extractModulesFragments from './extractModulesFragments'

const fragmentReplacements = extractModulesFragments()

export default new Prisma({
  typeDefs: __dirname + '/../generated/prisma.graphql',
  endpoint: process.env.PRISMA_ENDPOINT,
  secret: process.env.PRISMA_SECRET,
  fragmentReplacements
})
