const publishedFragment = 'fragment publishedField on Post { published }'

const Post = {
  id: {
    fragment: publishedFragment
  },
  title: {
    fragment: publishedFragment
  },
  body: {
    fragment: publishedFragment
  },
  author: {
    fragment: publishedFragment
  }
}

export { Post as default }
