import { checkUserAccess } from "../../utils/checkUserAccess";

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

    const error = await checkUserAccess({
      prisma: context.prisma,
      userId: context.userInfo?.payload?.userId,
      postId: args.postId,
    });

    if (error) {
      return error;
    }

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

  deletePost: async (parent: any, args: any, context: any) => {
    if (!context.userInfo || !context.userInfo?.payload?.userId) {
      return {
        post: null,
        userError: "You must be logged in to update a post",
      };
    }

    const error = await checkUserAccess({
      prisma: context.prisma,
      userId: context.userInfo?.payload?.userId,
      postId: args.postId,
    });

    if (error) {
      return error;
    }

    const deletePost = await context.prisma.post.delete({
      where: {
        id: Number(args.postId),
      },
    });

    return {
      post: deletePost,
      userError: null,
    };
  },

  publishPost: async (parent: any, args: any, context: any) => {
    if (!context.userInfo || !context.userInfo?.payload?.userId) {
      return {
        post: null,
        userError: "You must be logged in to publish a post",
      };
    }
    const error = await checkUserAccess({
      prisma: context.prisma,
      userId: context.userInfo?.payload?.userId,
      postId: args.postId,
    });
    if (error) {
      return error;
    }
    const publishPost = await context.prisma.post.update({
      where: { id: Number(args.postId) },
      data: { published: true },
    });

    return {
      post: publishPost,
      userError: null,
    };
  },
};
