import IAppContext from '../types/IAppContext'

const User = {
  posts: (parent, _, { user }: IAppContext) => {
    const posts = (parent && parent.posts) || []

    if (user && user.role === 'Admin') {
      return posts
    }

    return posts.filter(post => post.published)
  },
  email: {
    fragment: 'fragment userId on User { id }',
    resolve(parent, _, { user }: IAppContext) {
      if (user && (user.id === parent.id || user.role === 'Admin'))
        return parent.email

      return null
    }
  }
}

export default User
