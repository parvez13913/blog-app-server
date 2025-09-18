import bcrypt from "bcrypt";
import config from "../../config";
import { JwtHelper } from "../../utils/jwt-helper";

interface SignupType {
  name: string;
  email: string;
  password: string;
  bio?: string;
}
interface SigninType {
  email: string;
  password: string;
}
interface AddPostType {
  title: string;
  content: string;
}

export const Mutation = {
  signup: async (parent: any, args: SignupType, context: any) => {
    const isUserExist = await context.prisma.user.findFirst({
      where: { email: args.email },
    });

    if (isUserExist) {
      return {
        token: null,
        userError: "User already exists",
      };
    }

    const hashedPassword = await bcrypt.hash(args.password, 12);
    const newUser = await context.prisma.user.create({
      data: {
        name: args.name,
        email: args.email,
        password: hashedPassword,
      },
    });

    if (args.bio) {
      await context.prisma.profile.create({
        data: {
          bio: args.bio,
          userId: newUser.id,
        },
      });
    }

    const token = await JwtHelper.generateToken.sign(
      { userId: newUser.id },
      config.jwt.jwtSecret as string
    );

    return { token, userError: null };
  },
  signin: async (parent: any, args: SigninType, context: any) => {
    const user = await context.prisma.user.findFirst({
      where: { email: args.email },
    });
    if (!user) {
      return {
        token: null,
        userError: "User not found",
      };
    }
    const isValidPassword = await bcrypt.compare(args.password, user.password);

    if (!isValidPassword) {
      return {
        token: null,
        userError: "Invalid password",
      };
    }

    const token = await JwtHelper.generateToken.sign(
      { userId: user.id },
      config.jwt.jwtSecret as string
    );
    return { token, userError: null };
  },
  addPost: async (parent: any, args: AddPostType, context: any) => {
    console.log(context.userInfo, context.userInfo?.payload.userId);

    if (!context.userInfo || !context.userInfo?.payload?.userId) {
      return {
        post: null,
        userError: "You must be logged in to add a post",
      };
    }

    if (!args.title || !args.content) {
      return {
        post: null,
        userError: "Title and content cannot be empty",
      };
    }

    const newPost = await context.prisma.post.create({
      data: {
        title: args.title,
        content: args.content,
        authorId: context.userInfo?.payload?.userId,
      },
    });

    return {
      post: newPost,
      userError: null,
    };
  },
};
