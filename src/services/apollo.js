import { ApolloClient, InMemoryCache } from '@apollo/client/core';
import config from '@/config.js';
const API_URL = config.pokemon_server;

const client = new ApolloClient({
  uri: API_URL,
  cache: new InMemoryCache(),
});

export default client;