import { ApolloClient, InMemoryCache, HttpLink, gql } from '@apollo/client/core';
import fetch from 'cross-fetch';

export const userSubgraphClient = new ApolloClient({
  link: new HttpLink({
    uri: 'http://localhost:4001/graphql', // User subgraph
    fetch,
  }),
  cache: new InMemoryCache(),
});
