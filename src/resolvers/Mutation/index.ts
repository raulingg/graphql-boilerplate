import auth from './auth'
import user from './user'
import post from './post'
import comment from './comment'

const Mutation = {
  ...auth,
  ...user,
  ...post,
  ...comment
}

export default Mutation
