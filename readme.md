# GraphQL Boilerplate

> Prisma 1.30 + GraphQL Yoga + Typescript

## Before Starting

1. Install prisma cli: `npm install -g prisma`
2. Install [docker](https://docs.docker.com/get-started/)
3. Launch Prisma and the connected database: `docker-compose up -d`

   Prisma is now connected to a local database and runs on `http://localhost:4466`

4. Set your envars inside `config/dev.env`

   ```sh
   PRISMA_ENDPOINT=http://localhost:4466
   PRISMA_SECRET=pi389xjam2b3pjsd0
   JWT_SECRET=23oijdsm23809sdf
   ```

5. Deploy the Prisma datamodel: `prisma deploy -e config/.env.dev`

   This step generates the Prisma client automatically, also you can generate it again by running `prisma generate`, and seeds the database with testing data, also you can seed whenever you want by running `yarn database:seed`

**Note**: For more info about how to set up prisma with a new or existing database [here](https://www.prisma.io/docs/get-started/01-setting-up-prisma-new-database-JAVASCRIPT-a002/)

## Getting Started

1. Install dependencies:

   `yarn` or `npm install`

2. Run in local env:

   `yarn dev` or `npm run dev`

3. Visit: `http://localhost:4000`

## Using Prisma

### Entering to the database prisma

You can access to your database by running `prisma admin -e config/.env.dev`

### Generating a prisma token

You can generate an access token to use it at the playground by running `prisma token -e config/.env.dev`

**Note:** Remember you need to put your access token generated as a http header when you query using playground

```
{
	"Authorization":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiY2p1ZWlxd2NpMDBreDA4NjFrbDhnYjc1cyIsInJvbGUiOiJBZG1pbiJ9LCJpYXQiOjE1NTUxMDM1NTYsImV4cCI6MTU1NTcwODM1Nn0.4Y3QdckBpyk9xZcJhQsZlzVPfWbGSnpivaFTHAwQ0PU"
}
```

## Features

- Basic sign up
- Basic login with user and password
- JWT Authentication
- Authentication Middleware
- Authorization Middleware based on roles (User, Admin and Super)
- Set of directives for input validations
- Limitation of graph depth

## Uses

- [Prisma 1.3](https://github.com/prisma/prisma)
- [GraphQL Yoga](https://github.com/prisma/graphql-yoga)
- [GraphQL Playground](https://github.com/prisma/graphql-playground)
- [prisma-binding](https://github.com/prisma/prisma-binding)
- [graphql-shield](https://github.com/maticzav/graphql-shield)