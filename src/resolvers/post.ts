export const Post = {
  author: async (parent: any, args: any, context: any) => {
    return await context.prisma.user.findUnique({
      where: { id: parent.authorId },
    });
  },
};
