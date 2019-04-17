import user from './user'
import post from './post'
import comment from './comment'

const Query = {
  ...user,
  ...post,
  ...comment
}

export default Query
