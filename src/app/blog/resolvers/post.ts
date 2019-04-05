const publishedFragment = 'fragment publishedField on Post { published }'

export default {
  Post: {
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
}
