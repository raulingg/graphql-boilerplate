import { app } from '../config'
import { lstatSync, readdirSync } from 'fs'
import { join } from 'path'
import { extractFragmentReplacements } from 'prisma-binding'

const isDirectory = (fileName: string) => lstatSync(fileName).isDirectory()

export default () => {
  const modulePaths = readdirSync(app.basePath)
    .map(fileName => join(app.basePath, fileName))
    .filter(isDirectory)

  const fragmentsReplacements = modulePaths.map((modulePath: string) => {
    let moduleResolvers

    try {
      moduleResolvers = require(modulePath + '/resolvers').default
      return extractFragmentReplacements(moduleResolvers)
    } catch (error) {
      console.log(error.message)
    }
  })

  // Flatten all the fragments replacements each module
  return Array.prototype.concat.apply([], fragmentsReplacements)
}
