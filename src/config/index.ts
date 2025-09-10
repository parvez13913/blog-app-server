import path from "path";

require("dotenv").config({ path: path.join(process.cwd(), ".env") });

export default {
  jwt: {
    jwtSecret: process.env.JWT_SECRET,
  },
};
