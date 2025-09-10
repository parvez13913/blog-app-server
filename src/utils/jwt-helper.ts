import jwt, { Secret } from "jsonwebtoken";

const jwtHelper = {
  sign: (payload: { userId: number }, secret: Secret) => {
    const token = jwt.sign({ payload }, secret, {
      expiresIn: "1d",
    });
    return token;
  },
};
export default jwtHelper;
