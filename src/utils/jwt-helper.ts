import jwt, { Secret } from "jsonwebtoken";
import config from "../config";

const generateToken = {
  sign: (payload: { userId: number }, secret: Secret) => {
    const token = jwt.sign({ payload }, secret, {
      expiresIn: "1d",
    });
    return token;
  },
};

const getUserInfoFromToken = (token: string) => {
  try {
    const decodedData = jwt.verify(token, config.jwt.jwtSecret as string) as {
      userId: number;
    };
    return decodedData;
  } catch (error) {
    return null;
  }
};

export const JwtHelper = {
  generateToken,
  getUserInfoFromToken,
};
