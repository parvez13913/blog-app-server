export const Query = {
  me: async (parent: any, args: any, context: any) => {
    return await context.prisma.user.findFirst({
      where: { id: Number(context.userInfo?.payload?.userId) },
    });
  },
  profile: async (parent: any, args: any, context: any) => {
    return await context.prisma.profile.findUnique({
      where: { userId: Number(args.userId) },
    });
  },
  users: async (parent: any, args: any, context: any) => {
    return await context.prisma.user.findMany();
  },
  posts: async (parent: any, args: any, context: any) => {
    return await context.prisma.post.findMany({
      where: {
        published: false,
      },
      orderBy: [
        {
          createdAt: "desc",
        },
      ],
    });
  },
};
