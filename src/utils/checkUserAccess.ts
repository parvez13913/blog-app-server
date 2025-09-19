import { PrismaClient } from "@prisma/client";

export const checkUserAccess = async ({
  prisma,
  userId,
  postId,
}: {
  prisma: PrismaClient;
  userId: number | string;
  postId: number | string;
}) => {
  const user = await prisma.user.findUnique({
    where: { id: Number(userId) },
  });

  if (!user) {
    return {
      post: null,
      userError: "User not found",
    };
  }
  const isPostExist = await prisma.post.findUnique({
    where: {
      id: Number(postId),
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
};
