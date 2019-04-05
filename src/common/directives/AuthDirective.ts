import { SchemaDirectiveVisitor } from 'graphql-tools'
import { defaultFieldResolver } from 'graphql'
import { getUserFromToken } from '../../utils'

class AuthDirective extends SchemaDirectiveVisitor {
  visitObject(type: any) {
    this.ensureFieldsWrapped(type)
  }
  // Visitor methods for nested types like fields and arguments
  // also receive a details object that provides information about
  // the parent and grandparent types.
  visitFieldDefinition(field: any, details: any) {
    this.ensureFieldsWrapped(details.objectType)
  }

  ensureFieldsWrapped(objectType: any) {
    if (objectType._authFieldsWrapped) return

    objectType._authFieldsWrapped = true
    const fields = objectType.getFields()

    Object.keys(fields).forEach(fieldName => {
      const field = fields[fieldName]
      const { resolve = defaultFieldResolver } = field
      field.resolve = async function(...args: any) {
        // User already verified and user id exists
        if (args[2].userId) {
          return resolve.apply(this, args)
        }

        args[2].userId = getUserFromToken(args[2].request)

        return resolve.apply(this, args)
      }
    })
  }
}

export default AuthDirective
