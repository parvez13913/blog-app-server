import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import config from "../config";
import jwtHelper from "../utils/jwt-helper";

interface SignupType {
  name: string;
  email: string;
  password: string;
  bio?: string;
}
interface SigninType {
  email: string;
  password: string;
}

const prisma = new PrismaClient();

export const resolvers = {
  Mutation: {
    signup: async (parent: any, args: SignupType, context: any) => {
      const isUserExist = await prisma.user.findFirst({
        where: { email: args.email },
      });

      if (isUserExist) {
        return {
          token: null,
          userError: "User already exists",
        };
      }

      const hashedPassword = await bcrypt.hash(args.password, 12);
      const newUser = await prisma.user.create({
        data: {
          name: args.name,
          email: args.email,
          password: hashedPassword,
        },
      });

      if (args.bio) {
        await prisma.profile.create({
          data: {
            bio: args.bio,
            userId: newUser.id,
          },
        });
      }

      const token = await jwtHelper.sign(
        { userId: newUser.id },
        config.jwt.jwtSecret as string
      );

      return { token, userError: null };
    },
    signin: async (parent: any, args: SigninType, context: any) => {
      const user = await prisma.user.findFirst({
        where: { email: args.email },
      });
      if (!user) {
        return {
          token: null,
          userError: "User not found",
        };
      }
      const isValidPassword = await bcrypt.compare(
        args.password,
        user.password
      );

      if (!isValidPassword) {
        return {
          token: null,
          userError: "Invalid password",
        };
      }

      const token = await jwtHelper.sign(
        { userId: user.id },
        config.jwt.jwtSecret as string
      );
      return { token, userError: null };
    },
  },

  Query: {
    users: async (parent: any, args: any, context: any) => {
      return await prisma.user.findMany();
    },
    myProfile: async (parent: any, args: any, context: any) => {
      return await prisma.profile.findFirst({
        where: { id: context.id },
      });
    },
  },
};
