interface AddPostType {
  title: string;
  content: string;
}

export const postResolvers = {
  addPost: async (
    parent: any,
    { post }: { post: AddPostType },
    context: any
  ) => {
    if (!context.userInfo || !context.userInfo?.payload?.userId) {
      return {
        post: null,
        userError: "You must be logged in to add a post",
      };
    }

    if (!post.title || !post.content) {
      return {
        post: null,
        userError: "Title and content cannot be empty",
      };
    }

    const newPost = await context.prisma.post.create({
      data: {
        title: post.title,
        content: post.content,
        authorId: context.userInfo?.payload?.userId,
      },
    });

    return {
      post: newPost,
      userError: null,
    };
  },

  updatePost: async (
    parent: any,
    args: { postId: string; post: AddPostType },
    context: any
  ) => {
    if (!context.userInfo || !context.userInfo?.payload?.userId) {
      return {
        post: null,
        userError: "You must be logged in to update a post",
      };
    }
    const user = await context.prisma.user.findUnique({
      where: { id: context.userInfo?.payload?.userId },
    });

    if (!user) {
      return {
        post: null,
        userError: "User not found",
      };
    }
    const isPostExist = await context.prisma.post.findUnique({
      where: {
        id: Number(args.postId),
      },
    });

    if (!isPostExist) {
      return {
        post: null,
        userError: "Post not found",
      };
    }

    if (isPostExist?.authorId !== user?.id) {
      return {
        post: null,
        userError: "You are not authorized to update this post",
      };
    }
    console.log(args.post);

    const updatePost = await context.prisma.post.update({
      where: {
        id: Number(args.postId),
      },
      data: args.post,
    });

    return {
      post: updatePost,
      userError: null,
    };
  },
};
