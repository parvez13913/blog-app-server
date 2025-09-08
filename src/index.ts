import { ApolloServer } from "apollo-server";

import { resolvers } from "./resolvers";
import { typeDefs } from "./schema";

const server = new ApolloServer({ typeDefs, resolvers });

server.listen({ port: 4000 }).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
