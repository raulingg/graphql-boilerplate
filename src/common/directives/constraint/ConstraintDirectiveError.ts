class ConstraintDirectiveError extends Error {
  public code: string
  public context: any
  public fieldName: string

  constructor(fieldName: string, message: string, context: any) {
    super(message)
    this.name = this.constructor.name
    Error.captureStackTrace(this, this.constructor)

    this.code = 'ERR_GRAPHQL_CONSTRAINT_VALIDATION'
    this.fieldName = fieldName
    this.context = context
  }
}

export default ConstraintDirectiveError
