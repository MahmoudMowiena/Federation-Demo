import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { buildSubgraphSchema } from "@apollo/subgraph";
import gql from "graphql-tag";
import { userSubgraphClient } from "./apolloClient";

// 1. Define schema
const typeDefs = gql`
  type Post @key(fields: "id") {
    id: ID!
    title: String!
    author: User
  }

  extend type User @key(fields: "id") {
    id: ID! @external
    posts: [Post]
  }

  type Query {
    post(id: ID!): Post
    posts: [Post]
  }

  type Mutation {
    createPost(title: String!, authorId: ID!): Post
    updatePost(id: ID!, title: String!): Post
    deletePost(id: ID!): Boolean
  }
`;

// 2. Interfaces
interface User {
  id: string;
}

interface Post {
  id: string;
  title: string;
  authorId: string;
}

// 3. Dummy data
let posts: Post[] = [
  { id: "1", title: "GraphQL Federation Intro", authorId: "101" },
  { id: "2", title: "Apollo Server Basics", authorId: "101" },
  { id: "3", title: "Advanced Federation", authorId: "102" },
];

// 4. Resolvers
const resolvers = {
  Query: {
    posts: () => posts,
    post: (_: any, args: { id: string }) => posts.find((p) => p.id === args.id),
  },
  Post: {
    author: (post: Post): User => ({
      id: post.authorId,
    }),
  },
  User: {
    posts: (user: User): Post[] =>
      posts.filter((post) => post.authorId === user.id),
  },
  Mutation: {
    createPost: async (_: unknown, args: { title: string; authorId: string }) => {
      const userExists = await validateUserExists(args.authorId);
      if (!userExists) {
        throw new Error("Author not found.");
      }

      const newPost = {
        id: `${posts.length + 1}`,
        title: args.title,
        authorId: args.authorId,
      };
      posts.push(newPost);
      return newPost;
    },
    updatePost: (_: any, args: { id: string; title: string }) => {
      const post = posts.find((p) => p.id === args.id);
      if (!post) return null;
      if (args.title) post.title = args.title;
      return post;
    },
    deletePost: (_: any, args: { id: string }) => {
      const index = posts.findIndex((p) => p.id === args.id);
      if (index === -1) return false;
      posts.splice(index, 1);
      return true;
    },
  },
};

// 5. Apollo Client for User Validation
const GET_USER = gql`
  query ($id: ID!) {
    user(id: $id) {
      id
    }
  }
`;

async function validateUserExists(userId: string): Promise<boolean> {
  try {
    const { data } = await userSubgraphClient.query({
      query: GET_USER,
      variables: { id: userId },
    });

    return !!data?.user?.id;
  } catch (error) {
    console.error("Failed to fetch user from user subgraph:", error);
    return false;
  }
}

// 6. Apollo Server
const server = new ApolloServer({
  schema: buildSubgraphSchema({ typeDefs, resolvers }),
});

startStandaloneServer(server, {
  listen: { port: 4002 },
}).then(({ url }) => {
  console.log(`🚀 Posts subgraph ready at ${url}`);
});
