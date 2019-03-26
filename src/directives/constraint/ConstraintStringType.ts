import { GraphQLScalarType } from 'graphql'
import ConstraintDirectiveError from './ConstraintDirectiveError'
import { contains, isLength } from 'validator'
import formats from './formats'

class ConstraintStringType extends GraphQLScalarType {
  constructor(fieldName: string, type: any, args: Object) {
    super({
      name: 'ConstraintString',
      serialize(value) {
        return type.serialize(value)
      },
      parseValue(value) {
        value = type.serialize(value)
        validate(fieldName, args, value)

        return type.parseValue(value)
      },
      parseLiteral(ast) {
        const value = type.parseLiteral(ast)
        validate(fieldName, args, value)

        return value
      }
    })
  }
}

function validate(fieldName: string, args: any, value: string) {
  if (args.minLength && !isLength(value, { min: args.minLength })) {
    throw new ConstraintDirectiveError(
      fieldName,
      `Must be at least ${args.minLength} characters in length`,
      [{ arg: 'minLength', value: args.minLength }]
    )
  }

  if (args.maxLength && !isLength(value, { max: args.maxLength })) {
    throw new ConstraintDirectiveError(
      fieldName,
      `Must be no more than ${args.maxLength} characters in length`,
      [{ arg: 'maxLength', value: args.maxLength }]
    )
  }

  if (args.startsWith && !value.startsWith(args.startsWith)) {
    throw new ConstraintDirectiveError(
      fieldName,
      `Must start with ${args.startsWith}`,
      [{ arg: 'startsWith', value: args.startsWith }]
    )
  }

  if (args.endsWith && !value.endsWith(args.endsWith)) {
    throw new ConstraintDirectiveError(
      fieldName,
      `Must end with ${args.endsWith}`,
      [{ arg: 'endsWith', value: args.endsWith }]
    )
  }

  if (args.contains && !contains(value, args.contains)) {
    throw new ConstraintDirectiveError(
      fieldName,
      `Must contain ${args.contains}`,
      [{ arg: 'contains', value: args.contains }]
    )
  }

  if (args.notContains && contains(value, args.notContains)) {
    throw new ConstraintDirectiveError(
      fieldName,
      `Must not contain ${args.notContains}`,
      [{ arg: 'notContains', value: args.notContains }]
    )
  }

  if (args.pattern && !new RegExp(args.pattern).test(value)) {
    throw new ConstraintDirectiveError(
      fieldName,
      `Must match ${args.pattern}`,
      [{ arg: 'pattern', value: args.pattern }]
    )
  }

  if (args.format) {
    const formatter = formats[args.format]

    if (!formatter) {
      throw new ConstraintDirectiveError(
        fieldName,
        `Invalid format type ${args.format}`,
        [{ arg: 'format', value: args.format }]
      )
    }

    try {
      formatter(value)
    } catch (e) {
      throw new ConstraintDirectiveError(fieldName, e.message, [
        { arg: 'format', value: args.format }
      ])
    }
  }
}

export default ConstraintStringType
