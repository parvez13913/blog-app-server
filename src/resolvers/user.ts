export const User = {
  posts: async (parent: any, args: any, context: any) => {
    const isMyProfile = parent.id === context.userInfo?.payload?.userId;

    if (isMyProfile) {
      return await context.prisma.post.findMany({
        where: { authorId: parent.id },
      });
    } else {
      return await context.prisma.post.findMany({
        where: { authorId: parent.id, published: true },
      });
    }
  },
};
