const User = {
  posts: (parent: any, _: any, { user }: { user: any }) => {
    const posts = (parent && parent.posts) || []

    if (user.role === 'Admin') {
      return posts
    }

    return posts.filter((post: any) => post.published)
  },

  email: {
    fragment: 'fragment userId on User { id }',
    resolve(parent: any, _: any, { user }: { user: any }) {
      if (user && (user.id === parent.id || user.role === 'Admin'))
        return parent.email

      return null
    }
  }
}

export default User
