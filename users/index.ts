import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { buildSubgraphSchema } from "@apollo/subgraph";
import gql from "graphql-tag";

// 1. Define schema
const typeDefs = gql`
  type User @key(fields: "id") {
    id: ID!
    name: String!
    email: String!
  }

  type Query {
    user(id: ID!): User
    users: [User]
  }

  type Mutation {
    createUser(name: String!, email: String!): User
    updateUser(id: ID!, name: String, email: String): User
    deleteUser(id: ID!): Boolean
  }
`;

// 2. Interfaces
interface User {
  id: string;
  name: string;
  email: string;
}

// 3. Dummy data
let users: User[] = [
  { id: "101", name: "Mahmoud", email: "mahmoud@example.com" },
  { id: "102", name: "Nour", email: "nour@example.com" },
];

// 4. Resolvers
const resolvers = {
  Query: {
    users: () => users,
    user: (_: any, args: { id: string }) => users.find((u) => u.id === args.id),
  },
  User: {
    __resolveReference(reference: { id: string }) {
      return users.find((u) => u.id === reference.id);
    },
  },
  Mutation: {
    createUser: (_: unknown, args: { name: string; email: string }) => {
      const newUser = {
        id: `${users.length + 1 + 100}`,
        name: args.name,
        email: args.email,
      };
      users.push(newUser);
      return newUser;
    },
    updateUser: (_: unknown, args: { id: string; name?: string; email?: string }) => {
      const user = users.find((u) => u.id === args.id);
      if (!user) return null;
      if (args.name) user.name = args.name;
      if (args.email) user.email = args.email;
      return user;
    },
    deleteUser: (_: unknown, args: { id: string }) => {
      const userIndex = users.findIndex((u) => u.id === args.id);
      if (userIndex === -1) return false;
      users.splice(userIndex, 1);
      return true;
    }
  },
};

// 5. Apollo Server
const server = new ApolloServer({
  schema: buildSubgraphSchema({ typeDefs, resolvers }),
});

startStandaloneServer(server, {
  listen: { port: 4001 },
}).then(({ url }) => {
  console.log(`🚀 User subgraph ready at ${url}`);
});
