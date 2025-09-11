import { Prisma, PrismaClient } from "@prisma/client";
import { DefaultArgs } from "@prisma/client/runtime/library";
import { ApolloServer } from "apollo-server";
import { resolvers } from "./resolvers";
import { typeDefs } from "./schema";
import { JwtHelper } from "./utils/jwt-helper";

interface Context {
  prisma: PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>;
  userInfo: { userId: number } | null;
}

const prisma = new PrismaClient();
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }): Promise<Context> => {
    if (!req.headers.authorization) {
      return { prisma, userInfo: null };
    }

    const userInfo = await JwtHelper.getUserInfoFromToken(
      req.headers.authorization as string
    );
    return { prisma, userInfo };
  },
});

server.listen({ port: 4000 }).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
