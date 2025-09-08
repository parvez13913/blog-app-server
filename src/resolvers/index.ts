type Post = {
  id: string;
  title: string;
  content: string;
};

let posts: Post[] = []; // In-memory storage

export const resolvers = {
  Query: {
    posts: () => posts,
    post: (_: unknown, { id }: { id: string }) =>
      posts.find((p) => p.id === id),
  },
  Mutation: {
    createPost: (
      _: unknown,
      { title, content }: { title: string; content: string }
    ) => {
      const newPost: Post = {
        id: String(posts.length + 1),
        title,
        content,
      };
      posts.push(newPost);
      return newPost;
    },
  },
};
