import { createYoga, createSchema } from 'graphql-yoga';
import { typeDefs } from './type-defs.js';
import { resolvers } from './resolvers.js';
import TokenManager from '../security/token-manager.js';

const schema = createSchema({
  typeDefs,
  resolvers,
});

const yoga = createYoga({
  schema,
  graphqlEndpoint: '/graphql',
  context: ({ request }) => {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return { user: null };
    }

    try {
      const token = authHeader.split(' ')[1];
      const user = TokenManager.verifyAccessToken(token);
      return { user };
    } catch {
      return { user: null };
    }
  },
});

export default yoga;
