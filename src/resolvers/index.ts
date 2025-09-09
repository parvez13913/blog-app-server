import { PrismaClient } from "@prisma/client";

interface SignupType {
  name: string;
  email: string;
  password: string;
}

const prisma = new PrismaClient();

export const resolvers = {
  Mutation: {
    signup: async (parent: any, args: SignupType, context: any) => {
      return await prisma.user.create({
        data: args,
      });
    },
  },
};
