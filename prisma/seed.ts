import prisma from '../src/prisma'
import bcrypt from 'bcryptjs'

async function main() {
  await prisma.mutation.createUser({
    data: {
      name: 'Admin',
      email: 'admin@prisma.com',
      password: bcrypt.hashSync('12345678'),
      role: 'Admin',
      posts: {
        create: [
          {
            title: 'Post published by Raul',
            body: 'Prisma is the best',
            published: true
          },
          {
            title: 'Post unpublished by Raul',
            body: 'Prisma is the best',
            published: false
          }
        ]
      }
    }
  })

  const testUser = await prisma.mutation.createUser(
    {
      data: {
        name: 'Test User',
        email: 'test@prisma.com',
        role: 'User',
        password: bcrypt.hashSync('12345678'),
        posts: {
          create: {
            title: 'Post by Test user',
            body: 'Prisma is the best',
            published: true
          }
        }
      }
    },
    '{ id, posts { id }}'
  )

  await prisma.mutation.createComment({
    data: {
      text: 'First comment by Test User',
      author: {
        connect: {
          id: testUser.id
        }
      },
      post: {
        connect: {
          id: testUser.posts[0].id
        }
      }
    }
  })
}

main().catch(e => console.error(e))
