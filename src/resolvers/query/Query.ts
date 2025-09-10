export const Query = {
  users: async (parent: any, args: any, context: any) => {
    return await context.prisma.user.findMany();
  },
  myProfile: async (parent: any, args: any, context: any) => {
    return await context.prisma.profile.findFirst({
      where: { id: context.id },
    });
  },
};
