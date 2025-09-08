import { gql } from "apollo-server";

export const typeDefs = gql`
  type Post {
    id: ID!
    title: String!
    content: String!
    published: Boolean!
  }
`;
