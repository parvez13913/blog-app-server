import { Mutation } from "./mutation/Mutation";
import { Post } from "./post";
import { Query } from "./query/Query";
import { User } from "./user";

export const resolvers = {
  Query,
  Post,
  User,
  Mutation,
};
