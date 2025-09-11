import { gql } from "apollo-server";

export const typeDefs = gql`
  type Query {
    posts: [Post!]!
    users: [User!]!
    myProfile(id: ID!): Profile
  }

  type Mutation {
    signup(
      name: String!
      email: String!
      password: String!
      bio: String
    ): AuthPayload
    signin(email: String!, password: String!): AuthPayload
    addPost(title: String!, content: String!): PostPayload
  }

  type Post {
    id: ID!
    title: String!
    content: String!
    author: User
    createdAt: String!
    published: Boolean!
  }
  type User {
    id: ID!
    name: String!
    email: String!
    createdAt: String!
    posts: [Post]
  }

  type Profile {
    id: ID!
    bio: String!
    createdAt: String!
    user: User!
  }

  type AuthPayload {
    token: String
    userError: String
  }

  type PostPayload {
    userError: String
    post: Post
  }
`;
