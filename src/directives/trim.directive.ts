import { GraphQLString, GraphQLNonNull, GraphQLScalarType } from 'graphql'
import { SchemaDirectiveVisitor } from 'graphql-tools'

class TrimDirective extends SchemaDirectiveVisitor {
  visitInputFieldDefinition(field: any) {
    this.wrapType(field)
  }

  wrapType(field: any) {
    if (
      field.type instanceof GraphQLNonNull &&
      field.type.ofType === GraphQLString
    ) {
      field.type = new GraphQLNonNull(new TrimType(field.type.ofType))
    } else if (field.type === GraphQLString) {
      field.type = new TrimType(field.type)
    } else {
      throw new Error(`Not a string type: ${field.type}`)
    }
  }
}

class TrimType extends GraphQLScalarType {
  constructor(type: any) {
    super({
      name: 'TrimType',
      serialize(value) {
        return type.serialize(value).trim()
      },
      parseValue(value) {
        return type.parseValue(value).trim()
      },
      parseLiteral(ast) {
        return type.parseLiteral(ast).trim()
      }
    })
  }
}

export { TrimDirective as default, TrimType }
