import query from './query'
import mutation from './mutation'
import user from './user'
import post from './post'
import subscription from './subscription'

export default {
  ...query,
  ...mutation,
  ...user,
  ...post,
  ...subscription
}
