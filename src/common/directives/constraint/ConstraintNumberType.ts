import { GraphQLScalarType } from 'graphql'
import ConstraintDirectiveError from './ConstraintDirectiveError'

class ConstraintNumberType extends GraphQLScalarType {
  constructor(fieldName: string, type: any, args: any) {
    super({
      name: 'ConstraintNumber',
      serialize(value: any) {
        return type.serialize(value)
      },
      parseValue(value: any) {
        value = type.serialize(value)

        validate(fieldName, args, value)

        return type.parseValue(value)
      },
      parseLiteral(ast: any) {
        const value = type.parseLiteral(ast)

        validate(fieldName, args, value)

        return value
      }
    })
  }
}

function validate(fieldName: string, args: any, value: number) {
  if (args.min && value < args.min) {
    throw new ConstraintDirectiveError(
      fieldName,
      `Must be at least ${args.min}`,
      [{ arg: 'min', value: args.min }]
    )
  }

  if (args.max && value > args.max) {
    throw new ConstraintDirectiveError(
      fieldName,
      `Must be no greater than ${args.max}`,
      [{ arg: 'max', value: args.max }]
    )
  }

  if (args.exclusiveMin && value <= args.exclusiveMin) {
    throw new ConstraintDirectiveError(
      fieldName,
      `Must be greater than ${args.exclusiveMin}`,
      [{ arg: 'exclusiveMin', value: args.exclusiveMin }]
    )
  }
  if (args.exclusiveMax && value >= args.exclusiveMax) {
    throw new ConstraintDirectiveError(
      fieldName,
      `Must be no greater than ${args.exclusiveMax}`,
      [{ arg: 'exclusiveMax', value: args.exclusiveMax }]
    )
  }

  if (args.multipleOf && value % args.multipleOf !== 0) {
    throw new ConstraintDirectiveError(
      fieldName,
      `Must be a multiple of ${args.multipleOf}`,
      [{ arg: 'multipleOf', value: args.multipleOf }]
    )
  }
}

export default ConstraintNumberType
