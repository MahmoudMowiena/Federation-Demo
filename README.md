# GraphQL Federation Demo

This is a simple demo project showcasing **Apollo Federation** with a **gateway** and two federated subgraphs: `users` and `posts`. It demonstrates how to compose multiple GraphQL services into a single, unified API using Apollo's Federation architecture.


## ✨ Features

- Apollo Gateway composition
- Federated subgraphs (`users`, `posts`)
- Cross-subgraph references and resolvers
- In-memory dummy data
- Basic CRUD operations (Query & Mutation) for both Users and Posts
- `@key`, `@external`, and `extend type` Federation directives in action

## 🧱 Technologies Used

- [Apollo Server](https://www.apollographql.com/docs/apollo-server/)
- [Apollo Gateway](https://www.apollographql.com/docs/federation/gateway/)
- [Apollo Federation](https://www.apollographql.com/docs/federation/)
- [GraphQL](https://graphql.org/)
- TypeScript

## ⚙️ How It Works

### 1. Users Subgraph (`localhost:4001`)
- Defines a `User` type with basic fields: `id`, `name`, `email`.
- Supports `Query` and `Mutation` operations for managing users.
- Uses `@key(fields: "id")` to support Federation.

### 2. Posts Subgraph (`localhost:4002`)
- Defines a `Post` type referencing `User`.
- Extends the `User` type to provide a list of authored posts.
- Validates user existence by querying the `users` subgraph using `ApolloClient`.

### 3. Apollo Gateway (`localhost:4000`)
- Federates the two services and exposes a unified GraphQL schema to clients.

## 🚀 Getting Started

> Make sure you have **Node.js (>= 16)** and **npm** or **yarn** installed.

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/graphql-federation-demo.git
cd graphql-federation-demo
```

### 2. Install Dependencies

Install dependencies for each service:

```bash
cd gateway
npm install

cd ../users
npm install

cd ../posts
npm install
```

### 3. Run the Services

Start the subgraphs:

# Terminal 1: Users subgraph
```bash
cd users
npm start
```

# Terminal 2: Posts subgraph
```bash
cd posts
npm start
```

Then start the gateway:

# Terminal 3: Gateway
```bash
cd gateway
npm start
```

Once all services are running, access the unified GraphQL API at:

```
http://localhost:4000/graphql
```

---

## 🔍 Example Queries

### Query all users:

```graphql
query {
  users {
    id
    name
    email
    posts {
      id
      title
    }
  }
}
```

### Query all posts:

```graphql
query {
  posts {
    id
    title
    author {
      id
      name
    }
  }
}
```
